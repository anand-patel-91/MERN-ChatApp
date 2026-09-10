const express = require("express");

const router = express.Router();

const {
  signupUser,
  loginUser,
  searchUser,
  updateProfilePicture,
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

router.post("/login", loginUser);

router.post("/signup", signupUser);

router.use(requireAuth);

router.post("/search", searchUser);

router.patch("/profile-picture", updateProfilePicture);

module.exports = router;
