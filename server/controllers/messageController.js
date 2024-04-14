const Message = require("../models/messageModel");

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  const chat = await Message.findOne({ chatId });
  if (chat) {
    const messages = chat.messages;

    res.status(200).json(messages);
  } else res.status(200).json([]);
};

const createMessage = async (req, res) => {
  const { chatId, content, senderEmail } = req.body;

  try {
    const chat = await Message.findOneAndUpdate(
      { chatId },
      { $push: { messages: { content, senderEmail } } },
      { upsert: true, new: true }
    );
    res.status(200).json(chat.messages[chat.messages.length - 1]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createMessage, getMessages };
