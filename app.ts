import 'dotenv/config'
import express from 'express'
import { Application } from 'express'
import cors from 'cors'
import db from './database.ts'
import User from './user'

const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(
	express.urlencoded({
		extended: true
	})
)

const PORT = 8000

app.get("/", (req, res) => {
	res.send(JSON.stringify({ 'greeting': 'Welcome To JWT Authentication' }))
})

app.post("/auth/register", async (req, res) => {
	try {
		const { username, email, password } = req.body

		//const user: Awaited<User> = await db.getUserByEmail(email)
		const isRegistered: Awaited<Boolean> = await db.isUserRegistered(email)
		const isAvailable: Awaited<Boolean> = await db.isUserIdAvailable(username)

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

		const insertResult: Awaited<any> = await db.insertUser(user)
		const message: string = insertResult.success ? `User ${username} created successfully!` : `An error occurred user ${username} was not created`

		res.status(400).json({
			status: "400",
			success: insertResult.success,
			message: message,
			error: insertResult.error
		}).send()
	} catch (error) {
		console.log(error)
	}
})

app.listen(PORT, async () => {
	console.log(`Server started at http://localhost:${PORT}`)
	await db.connect()
})
