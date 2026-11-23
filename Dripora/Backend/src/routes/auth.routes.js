import {Router} from 'express';
import { validateRegisterUser, validateLoginUser } from '../validators/auth.validator.js';
import { loginUser, registerUser } from '../controllers/auth.controller.js';

const router = Router()


router.post("/register", validateRegisterUser, registerUser )

router.post("/login",validateLoginUser, loginUser )


export default router;