import pg from 'pg'
const { Pool } = pg

class Database {
  pool: pg.Pool

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      host: process.env.DB_HOST!,
      port: Number.parseInt(process.env.DB_PORT!),
      database: process.env.DB_DATABASE
    })
  }

  async query(text: string, params: Array<string>): Promise<pg.QueryResult> {
    return (await this.pool.query(text, params))
  }
}

export default new Database()