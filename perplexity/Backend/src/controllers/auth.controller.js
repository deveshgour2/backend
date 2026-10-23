import userModel from "../models/user.model.js"
import { sendEmail } from "../services/mail.service.js"

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

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        html: `  <p>Hi ${username},</p><p>Welcome to Perplexity! We're excited to have you on board.      Thank you for registering with us.</p>
                <p>Best regards,<br/>The Perplexity Team</p>`,
    })
}