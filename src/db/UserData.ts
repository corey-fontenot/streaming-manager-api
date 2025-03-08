import db from './index.ts'
import User from '../models/user.ts'
import logger from '../logger.ts'

class UserData {
  async isUserRegistered(email: string): Promise<boolean> {
    const queryStr: string = `SELECT * FROM users WHERE email=$1;`
    const result: Array<User> = (await db.query(queryStr, [email])).rows

    const registered: boolean = result.length > 0

    return registered
  }

  async isUserIdAvailable(userId: string): Promise<boolean> {
    const queryStr: string = `SELECT * FROM users WHERE "userId"=$1;`
    const result: Array<User> = (await db.query(queryStr, [userId])).rows
    const available: boolean = result.length === 0

    return available
  }

  async insertUser(user: User): Promise<boolean> {
    const queryStr = `INSERT INTO users ("userId", "email", "password", "createdTs", "updatedTs", "lastLogin") VALUES ($1, $2,$3, now(), now(), now()) RETURNING "userId";`
    const result: Array<string> = (await db.query(queryStr, [user.getUserId(), user.getEmail(), user.getPassword()])).rows

    return result.length > 0
  }

  async getUserByEmail(email: string): Promise<User> {
    logger.info(`Getting user with email: ${email} from the database`)
    const queryStr = `SELECT * FROM users WHERE email=$1;`
    const result: Array<User> = (await db.query(queryStr, [email])).rows

    if (result.length > 0) {
      return new User(result[0].userId, result[0].password, result[0].email, result[0].createdTs, result[0].updatedTs, result[0].lastLoginTs)
    }
    return new User()
  }

  async updateLastLogin(user: User): Promise<boolean> {
    const queryStr = `UPDATE users SET "lastLogin"=now() WHERE "userId"=$1 RETURNING "lastLogin";`
    const result: Array<Date> = (await db.query(queryStr, [user.getUserId()])).rows

    return result.length > 0
  }
}

export default new UserData()
