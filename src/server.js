import cors from "cors"
import "dotenv/config"
import express from "express"
import morgan from "morgan"
import { mongoConnect } from "./db/mongo.js"
import authRouter from "./routes/v1/auth/auth.js"
import dashboardRouter from "./routes/v1/client/dashboard.js"
import clientRouter from "./routes/v1/client/todo.js"
import userRouter from "./routes/v1/client/user.js"

// Create Express app
const app = express()

// Middleware
app.use(morgan("tiny"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/v1/auth", authRouter)
app.use("/v1/todos", clientRouter)
app.use("/v1/todos/dashboard", dashboardRouter)
app.use("/v1/user", userRouter)

app.get("/", (req, res) => {
	res.send("Hello World!")
})

try {
	mongoConnect()
	console.log("Database plugged in and healthy to serve.")
} catch (error) {
	console.error("Database connection error:", error)
}

if (process.env.NODE_ENV !== 'production') {
	const PORT = process.env.PORT || 5000
	app.listen(PORT, () => console.log(`Server ready on port ${PORT}`))
}

export default app