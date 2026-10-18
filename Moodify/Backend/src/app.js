const express = require("express")
const cookieParser = require('cookie-parser')
const userRoutes = require("./routes/auth.routes")
const  cors = require('cors')
const  songRoutes = require("./routes/song.routes")

const  app = express()


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use('/api/auth',userRoutes)
app.use("/api/songs",songRoutes)

module.exports = app