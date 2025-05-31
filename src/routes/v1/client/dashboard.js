import { Router } from "express"
import {
	getCount,
	getPriority,
	getTaskState,
	search,
} from "../../../controllers/v1/client/dashboard.js"
import { checkAuth } from "../../../middlewares/checkAuth.js"

const dashboardRouter = Router()

dashboardRouter.get("/getAll/:statusId", checkAuth, getTaskState)
dashboardRouter.get("/search", checkAuth, search)
dashboardRouter.get("/counts", checkAuth, getCount)
dashboardRouter.get("/priority", checkAuth, getPriority)

export default dashboardRouter
