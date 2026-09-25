const mongoose = require('mongoose')

const notesSchema = mongoose.Schema({
    title: String,
    description: String
}
)

const noteModels = mongoose.model('notes',notesSchema)

module.exports = noteModels