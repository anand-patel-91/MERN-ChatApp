const express = require("express");

const router = express.Router();

const {
  signupUser,
  loginUser,
  searchUser,
  updateProfilePicture,
  updateProfile,
  getUserProfile,
  getProfilePicture,
  deleteAccount,
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

router.post("/login", loginUser);

router.post("/signup", signupUser);

// Image elements cannot attach the app's Authorization header.
router.get("/profile/:_id/picture", getProfilePicture);

router.use(requireAuth);

router.post("/search", searchUser);

router.get("/profile/:_id", getUserProfile);

router.patch("/profile-picture", updateProfilePicture);

router.patch("/profile", updateProfile);

router.delete("/account", deleteAccount);

module.exports = router;
