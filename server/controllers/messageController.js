const Message = require('../models/messageModel')

const getMessages = async(req,res)=>{
    const messages = await Message.find({}).sort({createdAt:1})

    res.status(200).json(messages)
}

const createMessage = async(req, res)=>{
    const {content} = req.body

    try{
        const message = await Message.create({content})
        res.status(200).json(message)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

module.exports = {createMessage, getMessages}