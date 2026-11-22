import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(passport.initialize())

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (_, __, profile, done) => {
    return done(null, profile)
}))

app.get("/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
)

app.get("/auth/google/callback", 
    passport.authenticate("google", {
        session:false,
        failureRedirect: "/"}),
    (req, res) => {
        console.log(req.user);
        res.send("google authentication successfull")
    }
)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
