import bcrypt from 'bcrypt-ts'

class User {
  userId: string | undefined
  email: string | undefined
  password: string | undefined
  createdTs: Date | undefined
  updatedTs: Date | undefined
  lastLoginTs: Date | undefined

  constructor(userId?: string, password?: string, email?: string, createdTs?: Date, updatedTs?: Date, lastLogin?: Date) {
    this.userId = userId ?? undefined
    this.password = password ?? undefined
    this.email = email ?? undefined
    this.createdTs = createdTs ?? undefined
    this.updatedTs = updatedTs ?? undefined
    this.lastLoginTs = lastLogin ?? undefined
  }

  setUserId(userId: string): void {
    this.userId = userId
  }

  getUserId(): string | undefined {
    return this.userId
  }

  async encryptPassword(password: string): Promise<string> {
    const saltrounds = 10
    return await bcrypt.hash(password, saltrounds)
  }

  comparePassword(password: string, hashedPassword: string): Boolean {
    const match: any = (async () => {
      const result: Awaited<Boolean> = await bcrypt.compare(password, hashedPassword)
      return result
    })
    return match
  }

  setPassword(password: string): void {
    this.password = password
  }

  getPassword(): string | undefined {
    return this.password
  }

  setEmail(email: string): void {
    this.email = email
  }

  getEmail(): string | undefined {
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