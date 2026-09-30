const express = require("express")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const authRouter = express()

authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body

    const ifUserAlreadyExist = await userModel.findOne({ email })

    if (ifUserAlreadyExist) {
        return res.status(400).json({
            message: "User already exists with this email"
        })
    }

    const hash = crypto.createHash('md5').update(password).digest("hex")

    const user = await userModel.create({
        name, email, password: hash
    })

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET
    )

    res.cookie("JWT_token", token)

    res.status(201).json({
        message: "user created successfully",
        user: { id: user._id, name: user.name, email: user.email },
        token
    })
})

authRouter.post('/protected', (req, res) => {
    console.log(req.cookies)
})

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({
            message: "user not found with this email"
        })
    }


    const isPasswordMatched = user.password === crypto.createHash("md5").update(password).digest("hex")
    if (!isPasswordMatched) {
        return res.status(401).json({
            message: "Invalid Password"
        })
    }

    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET
    )
    res.cookie("Jwt_token", token)

    res.status(200).json({
        message: "logged in successfully",
        user: { id: user._id, name: user.name, email: user.email },
        token
    })

})


module.exports = authRouter