import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username is already exists"],
        required: [true, "username is required"],
        trim: true
    },
    email: {
        type: String,
        unique: [true, "email is already exists"],
        required: [true, "email is required"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: 6,
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return next()

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

const userModel = mongoose.model("users", userSchema)

export default userModel