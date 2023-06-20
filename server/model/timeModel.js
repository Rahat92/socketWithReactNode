const mongoose = require('mongoose')
const timeSchema = new mongoose.Schema({
    time: String,
})
module.exports = mongoose.model('time', timeSchema)