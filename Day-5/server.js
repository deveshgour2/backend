const app = require('./src/app')

const mongoose = require('mongoose')

function connectToDb(){
    mongoose.connect('mongodb+srv://deveshgour6_db_user:skxQ5Rg4NKk0EJKW@cluster0.x2d3ekq.mongodb.net/Day-5')

    console.log('Database created')
}

connectToDb()

app.listen(3000, ()=>{
    console.log("server running at port 3000");
    
})