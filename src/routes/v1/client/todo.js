import { Router } from "express";
import { create, deleteTodoById, getAll, getTodoById, update } from "../../../controllers/v1/client/todo.js";
import { checkAuth } from "../../../middlewares/checkAuth.js";

const clientRouter = Router();

clientRouter.post("/create", checkAuth, create)
clientRouter.get("/getAll", checkAuth, getAll)
clientRouter.get("/getAll/:todoId", checkAuth, getTodoById)
clientRouter.put("/update/:todoId", checkAuth, update)
clientRouter.delete("/delete/:todoId", checkAuth, deleteTodoById)

export default clientRouter