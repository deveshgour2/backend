const mongoose = require('mongoose')

function connectToDb(){
    mongoose.connect('mongodb+srv://deveshgour6_db_user:skxQ5Rg4NKk0EJKW@cluster0.x2d3ekq.mongodb.net/')

    .then(()=>{
        console.log('database created');
    })
}

module.exports = connectToDb