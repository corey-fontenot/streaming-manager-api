import 'dotenv/config'
import express from 'express'
import { Application } from 'express'
import cors from 'cors'
import auth from './routes/auth.ts'
import logger from './logger.ts'
import morganMiddleware from './middlewares/morgan.middleware.ts'

const app: Application = express()

app.use(morganMiddleware)

app.use(cors())
app.use(express.json())
app.use(
	express.urlencoded({
		extended: true
	})
)

// Add routes
app.use(auth)

const PORT = 8000

app.get("/", (req, res) => {
	res.send(JSON.stringify({ 'greeting': 'Welcome To JWT Authentication' }))
})



app.listen(PORT, async () => {
	logger.info(`Server started at http://localhost:${PORT}`)
})
