import bcrypt from 'bcrypt-ts'

class User {
  userId: string
  email: string
  password: string
  createdTs: Date | undefined
  updatedTs: Date | undefined
  lastLoginTs: Date | undefined

  constructor(userId?: string, password?: string, email?: string, createdTs?: Date, updatedTs?: Date, lastLogin?: Date) {
    this.userId = userId ?? ''
    this.password = password ?? ''
    this.email = email ?? ''
    this.createdTs = createdTs ?? undefined
    this.updatedTs = updatedTs ?? undefined
    this.lastLoginTs = lastLogin ?? undefined
  }

  setUserId(userId: string): void {
    this.userId = userId
  }

  getUserId(): string {
    return this.userId
  }

  async encryptPassword(password: string): Promise<string> {
    const saltrounds = 10
    return await bcrypt.hash(password, saltrounds)
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    const result: Awaited<boolean> = await bcrypt.compare(password, hashedPassword)
    return result
  }

  setPassword(password: string): void {
    this.password = password
  }

  getPassword(): string {
    return this.password
  }

  setEmail(email: string): void {
    this.email = email
  }

  getEmail(): string {
    return this.email
  }

  setCreatedTs(createdTs: Date): void {
    this.createdTs = createdTs
  }

  getCreatedTs(): Date | undefined {
    return this.createdTs
  }

  setUpdatedTs(updatedTs: Date): void {
    this.updatedTs = updatedTs
  }

  getUpdatedTs(): Date | undefined {
    return this.updatedTs
  }

  setLastLoginTs(lastLoginTs: Date): void {
    this.lastLoginTs = lastLoginTs
  }

  getLastLoginTs(): Date | undefined {
    return this.lastLoginTs
  }

}

export default User