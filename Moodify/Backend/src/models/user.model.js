const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'username is already registered'],
        required: [true, 'username is required']
    },
    email: {
        type: String,
        unique: [true, 'email is already registered'],
        required: [true, 'email is required']
    },
    password: {
        type: String,
        required: [true, "password is required"],
        select:false
    }
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel