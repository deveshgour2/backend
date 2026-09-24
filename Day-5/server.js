const app = require('./src/app')

const mongoose = require('mongoose')

function connectToDb() {
    mongoose.connect('')
    .then(()=>{
         console.log('Database created')
    })
}

connectToDb()

app.listen(3000, () => {
    console.log("server running at port 3000");

})