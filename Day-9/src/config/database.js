const mongoose = require("mongoose")
require("dotenv").config()

function connectToDb(){
    mongoose.connect(process.env.MONGO_URI)

    console.log("Connected  to Database")
}

module.exports = connectToDb