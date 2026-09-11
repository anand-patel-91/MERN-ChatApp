const Message = require("../models/messageModel");
const UserChat = require("../models/userChatModel");

const allowedAttachmentTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const isValidAttachment = (attachment) => {
  if (!attachment || typeof attachment !== "object") return false;

  const { name, type, size, data } = attachment;
  return (
    typeof name === "string" &&
    name.length > 0 &&
    name.length <= 200 &&
    typeof type === "string" &&
    allowedAttachmentTypes.has(type) &&
    Number.isInteger(size) &&
    size > 0 &&
    size <= 5 * 1024 * 1024 &&
    typeof data === "string" &&
    data.length <= 7200000 &&
    data.startsWith(`data:${type};base64,`) &&
    /^[A-Za-z0-9+/=]+$/.test(data.slice(data.indexOf(",") + 1))
  );
};

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

  const isSyncRequest = req.query.sync === "1" && req.query.since;
  const chat = isSyncRequest
    ? await Message.findOne({ chatId })
        .select({ "messages._id": 1, "messages.timestamp": 1 })
        .lean()
    : await Message.findOne({ chatId }).lean();

  if (chat) {
    const since = req.query.since ? new Date(req.query.since) : null;
    if (isSyncRequest && since && !Number.isNaN(since.getTime())) {
      const currentIds = chat.messages.map((message) => message._id.toString());
      const hasNewMessages = chat.messages.some(
        (message) => new Date(message.timestamp) > since
      );

      if (!hasNewMessages) {
        return res.status(200).json({ messages: [], currentIds });
      }

      const fullChat = await Message.findOne({ chatId }).select("messages").lean();
      const messages = fullChat.messages.filter(
        (message) => new Date(message.timestamp) > since
      );
      return res.status(200).json({ messages, currentIds });
    }

    const messages = since && !Number.isNaN(since.getTime())
      ? chat.messages.filter((message) => new Date(message.timestamp) > since)
      : chat.messages;

    res.status(200).json(messages);
  } else res.status(200).json([]);
};

const createMessage = async (req, res) => {
  const { chatId, content, attachment } = req.body;
  const hasContent = typeof content === "string" && content.trim().length > 0;
  const hasAttachment = isValidAttachment(attachment);

  if (
    !isChatParticipant(chatId, req.user._id) ||
    (!hasContent && !hasAttachment) ||
    (typeof content !== "undefined" &&
      (typeof content !== "string" || content.length > 2000)) ||
    (attachment && !hasAttachment)
  ) {
    return res.status(400).json({ error: "Invalid message" });
  }

  try {
    const chat = await Message.findOneAndUpdate(
      { chatId },
      {
        $push: {
          messages: {
            content: hasContent ? content.trim() : "",
            attachment: hasAttachment ? attachment : undefined,
            senderId: req.user._id,
          },
        },
      },
      { upsert: true, new: true }
    );
    res.status(200).json(chat.messages[chat.messages.length - 1]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const { messageId } = req.params;

  if (
    !isChatParticipant(chatId, req.user._id) ||
    typeof content !== "string" ||
    !content.trim() ||
    content.length > 2000
  ) {
    return res.status(400).json({ error: "Invalid message update" });
  }

  try {
    const chat = await Message.findOneAndUpdate(
      {
        chatId,
        messages: { $elemMatch: { _id: messageId, senderId: req.user._id } },
      },
      {
        $set: {
          "messages.$.content": content.trim(),
        },
      },
      { new: true }
    ).lean();

    if (!chat) {
      return res.status(404).json({ error: "Message not found" });
    }

    return res.status(200).json(
      chat.messages.find((message) => message._id.toString() === messageId)
    );
  } catch (error) {
    return res.status(400).json({ error: "Unable to edit message" });
  }
};

const deleteMessage = async (req, res) => {
  const { chatId } = req.body;
  const { messageId } = req.params;

  if (!isChatParticipant(chatId, req.user._id)) {
    return res.status(403).json({ error: "You cannot access this chat" });
  }

  try {
    const result = await Message.updateOne(
      { chatId },
      { $pull: { messages: { _id: messageId, senderId: req.user._id } } }
    );

    if (!result.modifiedCount) {
      return res.status(404).json({ error: "Message not found" });
    }

    const updatedChat = await Message.findOne({ chatId }).select("messages").lean();
    const latestMessage = updatedChat?.messages?.[updatedChat.messages.length - 1];
    const latestPreview = latestMessage
      ? latestMessage.content || `Attachment: ${latestMessage.attachment?.name || "file"}`
      : "No messages yet";
    const latestTimestamp = latestMessage?.timestamp || null;
    const participantIds = [chatId.slice(0, 24), chatId.slice(24)];

    await UserChat.updateMany(
      { Id: { $in: participantIds }, "chats.chatId": chatId },
      {
        $set: {
          "chats.$.lastMessage": latestPreview,
          "chats.$.lastMessageAt": latestTimestamp,
        },
      }
    );

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: "Unable to delete message" });
  }
};

const deleteMessagesForUser = async (userId) => {
  await Message.deleteMany({ chatId: { $regex: userId } });
};

module.exports = {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  deleteMessagesForUser,
};
