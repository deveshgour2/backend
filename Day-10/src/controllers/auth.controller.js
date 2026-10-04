const userModel = require('../models/user.model')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

async function registerController(req, res){
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

    const hash = await bcrypt.hash(password, 10)

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
        }, process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    res.cookie('token', token)

    res.status(201).json({
        message: "user registered successfully",
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            profile_image: user.profile_image
        }
    })
}

 async function loginController (req, res){
    const { email, username, password } = req.body

    const user = await userModel.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    })

    if (!user) {
        return res.status(404).json({
            message: "user not registered"
        })
    }

    
    const isPasswordMatched = await  bcrypt.compare(password, user.password)

    if (!isPasswordMatched) {
        return res.status(404).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie('token', token)

    res.status(200).json({
        message: "LoggenIn successfully",
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio

        }
    })
}



module.exports = {
    registerController,
    loginController
}