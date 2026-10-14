const {Router} = require("express")
const authController = require('../controllers/auth.controller')
const userRouter = Router()

userRouter.post('/register',authController.registerUser)

userRouter.post('/login',authController.loginUser)

module.exports = userRouter