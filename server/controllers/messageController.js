const Message = require("../models/messageModel");

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

  const chat = await Message.findOne({ chatId }).lean();
  if (chat) {
    const since = req.query.since ? new Date(req.query.since) : null;
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

module.exports = { createMessage, getMessages };
