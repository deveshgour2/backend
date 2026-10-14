const mongoose = require("mongoose")

async function connectToDB(){
   await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to database")
    })
    .catch(err =>{
        console.log("Error in connecting to db", err)
    })
}

module.exports = connectToDB