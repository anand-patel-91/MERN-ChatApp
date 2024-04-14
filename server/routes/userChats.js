const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  getUserChats,
  setUserChats,
} = require("../controllers/userChatsController");

const router = express.Router();

router.use(requireAuth);

router.post("/", setUserChats);

router.get("/:email", getUserChats);

module.exports = router;
