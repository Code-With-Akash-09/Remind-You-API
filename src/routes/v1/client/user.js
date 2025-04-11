import { Router } from "express";
import { profile, update } from "../../../controllers/v1/client/user.js";
import { checkAuth } from "../../../middlewares/checkAuth.js";

const userRouter = Router();

userRouter.get("/profile", checkAuth, profile)
userRouter.put("/profile/edit", checkAuth, update)

export default userRouter;
