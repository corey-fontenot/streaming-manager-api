import { Router } from 'express'
import User from '../user'
import jwt from 'jsonwebtoken'
import userData from '../db/UserData.ts'
import logger from '../logger.ts'

const app = Router()

app.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    //const user: Awaited<User> = await db.getUserByEmail(email)
    const isRegistered: Awaited<boolean> = await userData.isUserRegistered(email)
    const isAvailable: Awaited<boolean> = await userData.isUserIdAvailable(username)

    if (isRegistered) {
      logger.info(`User with email: ${email} is already registered`)
      res.status(400).json({
        status: "400",
        message: `User with email ${email} is already registered`
      }).send()
      return
    }

    if (!isAvailable) {
      logger.info(`Username: ${username} is not available`)
      res.status(400).json({
        status: "400",
        message: `Username: ${username} is not available`
      }).send()
      return
    }

    const user = new User()

    const encryptedPassword: Awaited<string> = await user.encryptPassword(password)
    user.setPassword(encryptedPassword)
    user.setUserId(username)
    user.setEmail(email)

    const insertResult: Awaited<boolean> = await userData.insertUser(user)
    const message: string = insertResult ? `User ${username} created successfully!` : `An error occurred user ${username} was not created`

    logger.info(message)

    res.status(400).json({
      status: "400",
      success: insertResult,
      message: message,
    }).send()
  } catch (error) {
    console.log(error)
  }
})

app.post("/auth/login", async (req, res) => {
  try {
    const data = req.body

    const { email, password } = data

    const registered: Awaited<boolean> = await userData.isUserRegistered(email)

    if (!registered) {
      const message: string = `User with email: ${email} was not found`
      logger.info(message)
      res.status(404).json({
        status: 404,
        success: false,
        message: message,
      })
      return
    }

    const user: Awaited<User> = await userData.getUserByEmail(email)
    const passwordMatches: Awaited<boolean> = await User.comparePassword(password, user.getPassword())

    if (!passwordMatches) {
      const message: string = `Entered password does not match for username: ${user.userId}`
      logger.info(message)
      res.status(400).json({
        status: 400,
        success: false,
        message: message,
      })
      return
    }

    const token = jwt.sign(
      {
        userId: user.getUserId(),
        email: user.getEmail()
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d"
      })

    userData.updateLastLogin(user)

    const message: string = `User: {userId: ${user.getUserId()}, email: ${user.getEmail()}} logged in successfully!`
    res.status(200).json({
      status: 200,
      success: true,
      message: message,
      token: token,
    })
  } catch (err: unknown) {
    res.status(500).json({
      status: 500,
      message: err,
    })
  }
})

export default app