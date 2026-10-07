const  express = require("express")
const identifyUser = require("../middlewares/auth.middleware")
const userController = require("../controllers/user.controller")

const userRouter = express.Router()

userRouter.post('/follow/:username',identifyUser, userController.followUserController)

userRouter.post('/unfollow/:username', identifyUser , userController.unfollowUserController)

module.exports = userRouter