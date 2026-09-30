const app = require("./src/app")
const connectToDatabase = require("./src/config/database")
require("dotenv").config()

connectToDatabase()

app.listen(3000,()=>{
    console.log("server running at port 3000")
})