import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
})

transporter.verify()
    .then(() => {
        console.log("email transporter is ready to send email")
    })

    .catch((err) => {
        console.error("email transporter verification failed", err)
    })

export async function sendEmail({ to, subject, html, text="" }) {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    }

    const details = await transporter.sendMail(mailOptions)
    console.log("Email sent: ", details)

    return "email sent successfully to " + to
}