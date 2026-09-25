const mongoose = require('mongoose')

function connectToDb(){
    mongoose.connect(process.env.MONGO_URI)

    .then(()=>{
        console.log('database created');
    })
}

module.exports = connectToDb