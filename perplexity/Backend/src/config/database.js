import mongoose from "mongoose"

async function connectToDatabase(){
   await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to database")
    })
}

export default connectToDatabase