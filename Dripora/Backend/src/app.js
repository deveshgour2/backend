import express from "express"
import morgan from "morgan"
import authRouter from "./routes/auth.routes.js"
import passport from "passport"
import { Strategy as googleStrategy } from "passport-google-oauth20"
import cors from "cors"

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())
passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile)
}))

app.use("/api/auth", authRouter)

export default app