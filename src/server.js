import cluster from "cluster"
import cors from "cors"
import "dotenv/config"
import express from "express"
import morgan from "morgan"
import { cpus } from "os"
import { mongoConnect } from "./db/mongo.js"
import authRouter from "./routes/v1/auth/auth.js"
import dashboardRouter from "./routes/v1/client/dashboard.js"
import learnRouter from "./routes/v1/client/learn.js"
import clientRouter from "./routes/v1/client/todo.js"
import userRouter from "./routes/v1/client/user.js"

// Create Express app
const app = express()

// Middleware
app.use(morgan("tiny"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (cluster.isPrimary) {
	console.log(`Number of CPUs is ${cpus().length}`)
	console.log(`Master ${process.pid} is running`)

	// Fork workers.
	for (let i = 0; i < cpus().length; i++) {
		cluster.fork()
	}

	cluster.on("exit", (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`)
		console.log("Let's fork another worker!")
		cluster.fork()
	})
} else {
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))

	// Routes
	app.use("/v1/auth", authRouter)
	app.use("/v1/todos", clientRouter)
	app.use("/v1/todos/dashboard", dashboardRouter)
	app.use("/v1/user", userRouter)
	app.use("/v1/learn", learnRouter)

	app.get("/", (req, res) => {
		res.send("Hello World!")
	})

	app.get("/ping", (req, res) => {
		res.status(200).send("OK")
	})

	if (process.env.NODE_ENV !== "development") {
		clientConnect()
	}

	mongoConnect()

	app.listen(parseInt(process.env.PORT), () =>
		console.log(`Server ready to roll on an anonymous port!`)
	)
}

export default app
