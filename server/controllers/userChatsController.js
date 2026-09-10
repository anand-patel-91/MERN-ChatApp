const UserChat = require("../models/userChatModel");

const isChatParticipant = (chatId, userId) => {
  if (typeof chatId !== "string" || !/^[a-f\d]{48}$/i.test(chatId)) {
    return false;
  }

  return [chatId.slice(0, 24), chatId.slice(24)].includes(userId.toString());
};

const getUserChats = async (req, res) => {
  const { _id } = req.params;
  if (_id !== req.user._id.toString()) {
    return res.status(403).json({ error: "You cannot access these chats" });
  }

  const messages = await UserChat.find({ Id: req.user._id }).lean();

  res.status(200).json(messages);
};

const setUserChats = async (req, res) => {
  const { Id, chatId, content, user } = req.body;

  if (
    Id !== req.user._id.toString() &&
    (!user || user._id !== req.user._id.toString())
  ) {
    return res.status(403).json({ error: "You cannot update these chats" });
  }

  if (
    !isChatParticipant(chatId, req.user._id) ||
    typeof content !== "string" ||
    !content.trim() ||
    content.length > 2000 ||
    !user ||
    typeof user.name !== "string" ||
    user.name.length > 50
  ) {
    return res.status(400).json({ error: "Invalid chat update" });
  }

  try {
    let chat = await UserChat.findOne({ Id });

    if (!chat) {
      chat = new UserChat({
        Id,
        chats: [
          {
            chatId,
            lastMessage: content.trim(),
            userInfo: { Id: user._id, name: user.name },
          },
        ],
      });
      await chat.save();
    } else {
      const existingChat = chat.chats.find((c) => c.chatId === chatId);
      if (existingChat) {
        existingChat.lastMessage = content.trim();
      } else {
        chat.chats.push({
          chatId,
          lastMessage: content.trim(),
          userInfo: { Id: user._id, name: user.name },
        });
      }
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getUserChats, setUserChats };
