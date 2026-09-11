const express = require("express");
const {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/:chatId", getMessages);

router.post("/", createMessage);

router.patch("/:messageId", updateMessage);

router.delete("/:messageId", deleteMessage);

module.exports = router;
