const Message = require("../models/messageModel");

const isChatParticipant = (chatId, userId) => {
  if (typeof chatId !== "string" || !/^[a-f\d]{48}$/i.test(chatId)) {
    return false;
  }

  return [chatId.slice(0, 24), chatId.slice(24)].includes(userId.toString());
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  if (!isChatParticipant(chatId, req.user._id)) {
    return res.status(403).json({ error: "You cannot access this chat" });
  }

  const chat = await Message.findOne({ chatId }).lean();
  if (chat) {
    const messages = chat.messages;

    res.status(200).json(messages);
  } else res.status(200).json([]);
};

const createMessage = async (req, res) => {
  const { chatId, content } = req.body;

  if (
    !isChatParticipant(chatId, req.user._id) ||
    typeof content !== "string" ||
    !content.trim() ||
    content.length > 2000
  ) {
    return res.status(400).json({ error: "Invalid message" });
  }

  try {
    const chat = await Message.findOneAndUpdate(
      { chatId },
      { $push: { messages: { content: content.trim(), senderId: req.user._id } } },
      { upsert: true, new: true }
    );
    res.status(200).json(chat.messages[chat.messages.length - 1]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createMessage, getMessages };
