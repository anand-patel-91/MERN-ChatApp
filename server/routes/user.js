const express = require("express");

const router = express.Router();

const {
  signupUser,
  loginUser,
  searchUser,
  updateProfilePicture,
  updateProfile,
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

router.post("/login", loginUser);

router.post("/signup", signupUser);

router.use(requireAuth);

router.post("/search", searchUser);

router.patch("/profile-picture", updateProfilePicture);

router.patch("/profile", updateProfile);

module.exports = router;
