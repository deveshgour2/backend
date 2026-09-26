const express = require('express')
const cors = require('cors')
const notemodels = require('./config/models/note.model')

const app = express()
app.use(cors())
app.use(express.json())


app.post('/api/notes', async (req, res) => {
    const { title, description } = req.body
    const notes = await notemodels.create({
        title, description
    })

    res.status(201).json({
        message: "notes created successfully",
        notes
    })
})

app.get('/api/notes', async (req, res) => {
    const notes = await notemodels.find()

    res.status(200).json({
        message: "notes fetched successfully",
        notes
    })
})

app.delete('/api/notes/:id', async (req, res) => {
    const id = req.params.id
    await notemodels.findByIdAndDelete(id)

    res.status(200).json({
        message: "note deleted successfully",

    })
})

app.patch('/api/notes/:id', async (req, res) => {
    const id = req.params.id
    const { description } = req.body
    const notes = await notemodels.findByIdAndUpdate(id, { description })

    res.status(201).json({
        message: "note updated successfully"
    })
})


module.exports = app