import { Router } from "express"
import { loginValidator, registerValidator } from "../validator/auth.validator.js"
import { getMe, login, register, verifyEmail } from "../controllers/auth.controller.js"
import { authUser } from "../middleware/auth.middleware.js"

const authRouter = Router()

authRouter.post('/register', registerValidator, register)

authRouter.get('/verify-email', verifyEmail)

authRouter.post('/login', loginValidator, login)

authRouter.get("/get-me",authUser, getMe)

export default authRouter