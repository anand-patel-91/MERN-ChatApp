const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const getContacts = require("../controllers/contactsController");

const router = express.Router();

router.use(requireAuth);

router.get("/", getContacts);

module.exports = router;
