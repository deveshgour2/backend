const express = require('express')
const noteModels = require('./models/notes.models')

const app = express()

app.use(express.json())

app.post('/notes',async (req, res)=>{
    const {title, description } = req.body

    const notes = await noteModels.create({
        title, description
    })

    res.status(201).json({
        message: "note created successfully",
        notes
    })
})

app.get('/notes',async (req, res)=>{
    const notes = await noteModels.find()

    res.status(200).json({
        message:"Notes find successfully",
        notes
    })
})


module.exports = app 