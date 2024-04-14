const UserChat = require("../models/userChatModel");

const getUserChats = async (req, res) => {
  const { email } = req.params;
  const messages = await UserChat.find({ email });
  
  res.status(200).json(messages);
};

const setUserChats = async (req, res) => {
  const { email, chatId, content, user } = req.body;
  
  try {
    let chat = await UserChat.findOne({ email });

    if (!chat) {
      chat = new UserChat({ email, chats: [{ chatId, lastMessage:content, userInfo:{email:user.email, name:user.name} }] });
      await chat.save();
    } else {
      const existingChat = chat.chats.find((c) => c.chatId === chatId);
      if (existingChat) {
        existingChat.lastMessage = content;
      } else {
        chat.chats.push({ chatId, lastMessage:content, userInfo:{email:user.email, name:user.name} });
      }
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getUserChats, setUserChats };
