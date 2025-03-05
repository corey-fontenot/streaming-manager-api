import { Router } from 'express'
import User from '../user'
import jwt from 'jsonwebtoken'
import userData from '../db/UserData.ts'

const app = Router()

app.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    //const user: Awaited<User> = await db.getUserByEmail(email)
    const isRegistered: Awaited<Boolean> = await userData.isUserRegistered(email)
    const isAvailable: Awaited<Boolean> = await userData.isUserIdAvailable(username)

    if (isRegistered) {
      res.status(400).json({
        status: "400",
        message: "User already exists"
      }).send()
      return
    }

    if (!isAvailable) {
      res.status(400).json({
        status: "400",
        message: "Username is taken"
      }).send()
      return
    }

    const user = new User()

    const encryptedPassword: Awaited<string> = await user.encryptPassword(password)
    user.setPassword(encryptedPassword)
    user.setUserId(username)
    user.setEmail(email)

    const insertResult: Awaited<Boolean> = await userData.insertUser(user)
    const message: string = insertResult ? `User ${username} created successfully!` : `An error occurred user ${username} was not created`

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

    const registered: Awaited<Boolean> = await userData.isUserRegistered(email)

    if (!registered) {
      res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      })
      return
    }

    const user: Awaited<User> = await userData.getUserByEmail(email)
    const passwordMatches: Awaited<Boolean> = await User.comparePassword(password, user.getPassword())

    if (!passwordMatches) {
      res.status(400).json({
        status: 400,
        success: false,
        message: "Password does not match",
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

    res.status(200).json({
      status: 200,
      success: true,
      message: "login success",
      token: token,
    })
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message.toString(),
    })
  }
})

export default app