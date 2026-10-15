const {Router} = require("express")
const authController = require('../controllers/auth.controller')
const userRouter = Router()
const authMiddleware = require('../middlewares/auth.middleware')

userRouter.post('/register',authController.registerUser)

userRouter.post('/login',authController.loginUser)

userRouter.get('/get-me',authMiddleware.authUser,authController.getMe)

userRouter.get('/logout',authController.logoutUser)

module.exports = userRouter