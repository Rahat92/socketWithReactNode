const Message = require('../models/Message');

exports.createMessage = async (req, res) => { 
    try {
        const { message } = req.body;
        const newMessage = await Message.create({ message });
        res.status(201).json({
            status: 'success',
            data: {
                message: newMessage
            }
        });
    } catch (err) {
        console.log(err);
    }
};