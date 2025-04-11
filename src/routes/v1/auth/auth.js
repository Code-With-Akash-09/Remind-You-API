import { Router } from "express";
import { logIn, signUp } from "../../../controllers/v1/auth/auth.js";

const authRouter = Router()

authRouter.post("/signup", signUp)
authRouter.post("/login", logIn)

export default authRouter