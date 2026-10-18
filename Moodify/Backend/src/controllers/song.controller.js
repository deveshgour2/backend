const songModel = require("../models/songs.model")
const storageService = require("../services/storage.services")
const id3 = require("node-id3")

async function uploadSong(req, res) {

    const songBuffer = req.file.buffer
    const { mood } = req.body

    const tags = id3.read(songBuffer)

    const [songFile, posterFile] = await Promise.all([
    storageService.uploadFile({
        buffer: songBuffer,
        filename: tags.title + ".mp3",
        folder: "/moodify/songs"
    }),

    storageService.uploadFile({
        buffer: tags.image.imageBuffer,
        filename: tags.title + ".jpeg",
        folder: "/moodify/posters"
    })])

    const song = await songModel.create({
        title: tags.title,
        url: songFile.url,
        posterUrl: posterFile.url,
        mood
    })

    res.status(201).json({
        message: "song created successfully",
        song
    })
}

module.exports = {
    uploadSong
}