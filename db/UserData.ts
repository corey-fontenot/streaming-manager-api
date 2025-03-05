import db from './index.ts'
import User from '../user.ts'

class UserData {
  async isUserRegistered(email: string): Promise<Boolean> {
    const queryStr: string = `SELECT * FROM users WHERE email=$1;`
    const result: any = await db.query(queryStr, [email])

    return result.length > 0
  }

  async isUserIdAvailable(userId: string): Promise<Boolean> {
    const queryStr: string = `SELECT * FROM users WHERE "userId"=$1;`
    const result: Array<any> = await db.query(queryStr, [userId])

    return result.length === 0
  }

  async insertUser(user: User): Promise<Boolean> {
    const queryStr = `INSERT INTO users ("userId", "email", "password", "createdTs", "updatedTs", "lastLogin") VALUES ($1, $2,$3, now(), now(), now()) RETURNING "userId";`
    const result: Array<any> = await db.query(queryStr, [user.getUserId(), user.getEmail(), user.getPassword()])

    return result.length > 0
  }

  async getUserByEmail(email: string): Promise<User> {
    const queryStr = `SELECT * FROM users WHERE email=$1;`
    const result: Array<any> = await db.query(queryStr, [email])
    if (result.length > 0) {
      return new User(result[0].userId, result[0].password, result[0].email, result[0].createdTs, result[0].updatedTs, result[0].lastLoginTs)
    }
    return new User()
  }

  async updateLastLogin(user: User): Promise<Boolean> {
    const queryStr = `UPDATE users SET "lastLogin"=now() WHERE "userId"=$1 RETURNING "lastLogin";`
    const result: Array<any> = await db.query(queryStr, [user.getUserId()])

    return result.length > 0
  }
}

export default new UserData()
