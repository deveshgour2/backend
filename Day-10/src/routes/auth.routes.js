const express = require('express')
const authController = require("../controllers/auth.controller")

const authRouter = express()


authRouter.post('/register', authController.registerController)

authRouter.post('/login',authController.loginController)


module.exports = authRouter