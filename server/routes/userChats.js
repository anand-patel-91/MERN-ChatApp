const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  getUserChats,
  setUserChats,
  markChatRead,
} = require("../controllers/userChatsController");

const router = express.Router();

router.use(requireAuth);

router.post("/", setUserChats);

router.patch("/:chatId/read", markChatRead);

router.get("/:_id", getUserChats);

module.exports = router;
