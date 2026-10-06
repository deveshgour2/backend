const  express = require("express")
const identifyUser = require("../middlewares/auth.middleware")
const userController = require("../controllers/user.controller")

const userRouter = express.Router()

userRouter.post('/follow/:username',identifyUser, userController.followUserController)

module.exports = userRouter