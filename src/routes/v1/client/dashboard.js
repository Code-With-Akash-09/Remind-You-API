import { Router } from "express";
import { getTaskState, search } from "../../../controllers/v1/client/dashboard.js";
import { checkAuth } from "../../../middlewares/checkAuth.js";

const dashboardRouter = Router();

dashboardRouter.get("/getAll/:statusId", checkAuth, getTaskState)
dashboardRouter.get("/search", checkAuth, search)

export default dashboardRouter;