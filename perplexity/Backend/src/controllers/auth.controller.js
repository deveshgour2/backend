import userModel from "../models/user.model.js"
import { sendEmail } from "../services/mail.service.js"
import jwt from "jsonwebtoken"

export async function register(req, res) {
    const { username, email, password } = req.body

    const isUserExists = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserExists) {
        return res.status(400).json({
            message: "user with this email or username is already exists",
            success: false,
            err: "user already exists"
        })
    }

    const user = await userModel.create({ username, email, password })

    const emailVerificationToken = jwt.sign({
        userId: user._id,
        email: user.email
    }, process.env.JWT_SECRET
    )


    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        html: `  <p>Hi ${username},</p><p>Welcome to Perplexity! We're excited to have you on board.<br/>Please click the link below to verify your email address.</p>
                <p><a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a></p>
                <p>Thank you for registering with us.</p>
                <p>if you not registered with us, please ignore this email.</p>
                <p>Best regards,<br/>The Perplexity Team</p>`,
    })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

export async function verifyEmail(req, res) {
    try {
        const { token } = req.query

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({
            email: decoded.email
        })

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "user not found"
            })
        }

        user.verified = true

        await user.save()

        const html = `
    <h1>Email Verified Successfully</h1>
    <p>Your email has been verified successfully. You can now log in to your account.</p>
    <a href="http://localhost:3000/api/auth/login">Login</a>`

        return res.send(html)
    } catch (err) {
        res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }

}

export async function login(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "user not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "incorrect password"
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before Login",
            success: false,
            err: "email not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
       
    }, process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        })

    res.cookie("token", token)

    res.status(200).json({
        message:"login successfully",
        success:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

export async function getMe(req, res){
    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password")

    if(!user){
        return res.status(404).json({
            message:"user not found",
            success:false,
            err:"user not found"
        })
    }

    res.status(200).json({
        message:"user fetched successfully",
        success:true,
        user
    })
}