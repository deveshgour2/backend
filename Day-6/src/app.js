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


app.delete('/notes/:id', async (req, res)=>{
    const notes = await noteModels.deleteOne({
       _id :  req.params.id
    })

    res.status(204).json({
        message:'note deleted successfully',
        
    })
})

app.patch('/notes/:id',async (req, res)=>{
    const {description}  = req.body
    const notes = await noteModels.findByIdAndUpdate(
        req.params.id,
        { description},
        {new:true}
    )

    res.status(200).json({
        message: 'note updated successfully',
        notes
    })
})

module.exports = app 