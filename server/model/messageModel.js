const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: String,
    name: String,
    time: Date,
    timestamp: String,
    received: Boolean,
});

module.exports = mongoose.model('message', messageSchema);