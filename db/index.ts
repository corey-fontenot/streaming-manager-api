import pg from 'pg'
const { Pool } = pg

class Database {
  pool: pg.Pool

  constructor() {
    this.pool = new Pool({
      user: 'dbapp',
      password: 'password',
      host: 'localhost',
      port: 5432,
      database: 'postgres'
    })
  }

  async query(text: string, params: Array<string>, callback?: any): Promise<Array<any>> {
    return (await this.pool.query(text, params)).rows
  }
}

export default new Database()