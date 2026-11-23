import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

async function sendTokenResponse(user, res, message) {

    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token)

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullName: user.fullName,
            role: user.role,
        }
    })
}

export const registerUser = async (req, res) => {
    const { email, contact, fullName, password, isSeller } = req.body;

    try {
        const isUserExsist = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (isUserExsist) {
            return res.status(400).json({
                message: "user is already exists with this email or contact"
            })
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullName, 
            role: isSeller ? "seller" : "buyer"
        })

        await sendTokenResponse(user, res, "user registered successfully")

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}