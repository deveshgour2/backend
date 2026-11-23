import {body, validationResult} from 'express-validator';


function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


export const validateRegisterUser = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address"),
  
    body("contact")
        .notEmpty()
        .isMobilePhone()
        .withMessage("Please provide a valid contact number"),
   
    body("fullName")
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Full name is required"),
   
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("isSeller")
        .isBoolean()
        .withMessage("isSeller must be a boolean value"),

    validateRequest
]

export const validateLoginUser = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address"),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    validateRequest
]