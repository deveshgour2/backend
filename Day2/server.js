const express = require("express")

const app = express()

app.use(express.json())

const notes = []

app.post('/user', (req, res) => {
    console.log(req.body);
    notes.push(req.body)
    res.send("user created")
})

app.get('/user', (req, res) => {
    res.send(notes)
})



app.listen(3000, () => {
    console.log("server is running on port 3000");

})