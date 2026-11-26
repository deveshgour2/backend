import { Router } from 'express';
import { validateRegisterUser, validateLoginUser } from '../validators/auth.validator.js';
import { googleAuthCallback, loginUser, registerUser } from '../controllers/auth.controller.js';
import passport from 'passport';
import { config } from '../config/config.js';

const router = Router()


router.post("/register", validateRegisterUser, registerUser)

router.post("/login", validateLoginUser, loginUser)

router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get("/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"
    }),
    googleAuthCallback
)


export default router;