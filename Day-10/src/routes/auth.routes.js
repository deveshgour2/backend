const express = require('express')
const userModel = require('../models/user.model')
const crypto = require("crypto")
const jwt = require("jsonwebtoken")


const authRouter = express()


authRouter.post('/register', async (req, res) => {
    const { username, email, password, bio, profile_image } = req.body

    const ifUserAlreadyExists = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (ifUserAlreadyExists) {
        res.status(409).json({
            message: "user already exists " + (ifUserAlreadyExists.email) == email ? "email already exists" : "username already exists"
        })
    }

    const hash = crypto.createHash('md5').update(password).digest('hex')

    const user = await userModel.create({
        username,
        email,
        password: hash,
        bio,
        profile_image
    })

    const token = jwt.sign(
        {
            id: user._id
        },process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie('jwt_token', token)

    res.status(201).json({
        message:"user created successfully",
        user:{
            email:user.email,
            username:user.username,
            bio:user.bio,
            profile_image:user.profile_image
        }
    })
})


module.exports = authRouter