import pg, { Client } from 'pg'
import User from './user'


class DBConnection {
  client: Client

  constructor() {
    const conString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/postgres`

    this.client = new pg.Client(conString)

    //this.client.query("SET search_path TO 'STREAMING_LIST_APP';")

  }

  async connect() {
    await this.client.connect().then(() => {
      console.log("Database connected successfully")
    }
    )
  }

  async executeQuery(sql: string): Promise<Array<any>> {

    const queryResult: Awaited<pg.QueryResult<any>> = await this.client.query(sql)

    if (queryResult.rows.length == 0) {
      return []
    } else {
      return queryResult.rows
    }
    // const result = await this.client.query(sql).then((res) => {
    //   if (res.rows.length == 0) {
    //     return []
    //   } else {
    //     return res.rows
    //   }
    // }).catch((error) => {
    //   console.log(error)
    //   return []
    // }).finally(() => {
    //   console.log(`Query: "${sql}" completed`)
    // })
  }

  async executeInsert(query: string): Promise<any> {
    try {
      const res = await this.client.query(query)

      return {
        success: true,
        error: undefined
      }
    } catch (err) {
      return {
        success: false,
        error: err
      }
    }

  }

  async isUserRegistered(email: string): Promise<Boolean> {
    const query = `SELECT * FROM users WHERE email='${email}';`
    const res: Awaited<Array<any>> = await this.executeQuery(query)

    return res.length > 0
  }

  async isUserIdAvailable(userId: string): Promise<Boolean> {
    const query = `SELECT * FROM users WHERE "userId"='${userId}';`

    const res: Awaited<Array<any>> = await this.executeQuery(query)

    return res.length == 0
  }

  async insertUser(user: User): Promise<any> {
    const query = `INSERT INTO users ("userId", "email", "password", "createdTs", "updatedTs", "lastLogin") VALUES ('${user.getUserId()}', '${user.getEmail()}','${user.getPassword()}', now(), now(), now());`
    const result: any = await this.executeInsert(query)
    return result
  }

  async getUserByEmail(email: string): Promise<User> {
    const query = `SELECT * FROM users WHERE email='${email}';`
    let user = new User()
    const res: Awaited<Array<any>> = await this.executeQuery(query)
    if (res.length > 0) {
      user = new User(res[0].userId, res[0].password, res[0].email, res[0].createdTs, res[0].updatedTs, res[0].lastLoginTs)
    }
    return user

    // if (result.length === 0) {
    //   return new User()
    // } else {
    //   const { userId, password, email, createdTs, updatedTs, lastLoginTs } = result[0]
    //   return new User(userId, password, email, createdTs, updatedTs, lastLoginTs)
    // }
  }
}

const db = new DBConnection()
export default db