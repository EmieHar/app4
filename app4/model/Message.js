const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    iduser: String,
    message: String,
    firstname: String,
    lastname: String,
    date: Date
})

module.exports = mongoose.model("Message", messageSchema)