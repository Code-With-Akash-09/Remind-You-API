import { Router } from "express"
import {
	create,
	deleteLearnById,
	getAllPrivate,
	getAllPublic,
	getLearnById,
	update,
} from "../../../controllers/v1/client/learn.js"
import { checkAuth } from "../../../middlewares/checkAuth.js"

const learnRouter = Router()

learnRouter.post("/create", checkAuth, create)
learnRouter.get("/getAll/private", checkAuth, getAllPrivate)
learnRouter.get("/getAll/public", getAllPublic)
learnRouter.get("/getAll/:learnId", getLearnById)
learnRouter.put("/update/:learnId", checkAuth, update)
learnRouter.delete("/delete/:learnId", checkAuth, deleteLearnById)

export default learnRouter
