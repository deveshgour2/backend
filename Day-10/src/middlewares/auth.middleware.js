const jwt = require('jsonwebtoken')
const cookies = require("cookie-parser")

async function identifyUser(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "token not provided, unauthorized access"
        })
    }

    let decoded = null

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            message: "user not authorized"
        })
    }

    decoded = req.user
    next()
}

module.exports = identifyUser