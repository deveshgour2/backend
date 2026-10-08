const userModel = require('../models/user.model')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

async function registerController(req, res) {
    const { username, email, password, bio, profile_image, isPrivate } = req.body

    const ifUserAlreadyExists = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (ifUserAlreadyExists) {
        res.status(409).json({
            message: (ifUserAlreadyExists.email) == email ? "email already exists" : "username already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash,
        bio,
        profile_image,
        isPrivate
    })

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
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
            profile_image: user.profile_image,
            private: user.isPrivate
        }
    })
}

async function loginController(req, res) {
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


    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) {
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie('token', token)

    res.status(200).json({
        message: "LoggedIn successfully",
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            private: user.isPrivate
        }
    })
}

async function getMecontroller(req, res){
    const userId = req.user.id

    const user = await userModel.findById(userId)

    res.status(200).json({
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profile_image:user.profile_image
        }
    })
}



module.exports = {
    registerController,
    loginController,
    getMecontroller
}