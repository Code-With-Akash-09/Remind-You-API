import cluster from "cluster"
import cors from "cors"
import "dotenv/config"
import express from "express"
import morgan from "morgan"
import { cpus } from "os"
import { mongoConnect } from "./db/mongo.js"
import authRouter from "./routes/v1/auth/auth.js"
import dashboardRouter from "./routes/v1/client/dashboard.js"
import clientRouter from "./routes/v1/client/todo.js"
import userRouter from "./routes/v1/client/user.js"

console.log(cpus().length)

const app = express()

app.use(morgan("tiny"))

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (cluster.isPrimary) {
	console.log(`Number of CPUs is ${cpus().length}`)
	console.log(`Master ${process.pid} is running`)

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

	app.use("/v1/auth", authRouter)
	app.use("/v1/todos", clientRouter)
	app.use("/v1/todos/dashboard", dashboardRouter)
	app.use("/v1/user", userRouter)

	app.get("/", (req, res) => {
		res.send("Hello World! " + process.pid)
	})

	mongoConnect()

	app.listen(parseInt(process.env.PORT), () =>
		console.log(`Server ready to roll on an anonymous port!`)
	)
}
