import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: "gmail",
     auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
})

transporter.verify()
    .then(() => {
        console.log("email transporter is ready to send email")
    })

    .catch((err) => {
        console.error("email transporter verification failed", err)
    })

    export async function sendEmail({to, subject, html, text}){
        const mailOptions = {
            from:process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text
        }

        const details = await transporter.sendMail(mailOptions)
        console.log("Email sent: ", details)
    }