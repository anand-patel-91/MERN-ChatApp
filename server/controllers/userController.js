const User = require("../models/userModel");
const UserChat = require("../models/userChatModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const profilePictureUrl = (req, userId) =>
  `${req.protocol}://${req.get("host")}/api/user/profile/${userId}/picture`;

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({
      email: user.email,
      name: user.name,
      profilePic: user.profilePic ? profilePictureUrl(req, user._id) : "",
      token,
      _id: user._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { email, name, password, profilePic } = req.body;

  try {
    const user = await User.signup(email, name, password, profilePic);

    const token = createToken(user._id);

    res.status(200).json({
      email: user.email,
      name: user.name,
      profilePic: user.profilePic ? profilePictureUrl(req, user._id) : "",
      token,
      _id: user._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProfilePicture = async (req, res) => {
  const { profilePic } = req.body;
  const profilePicPattern = /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/]+=*$/;

  if (
    typeof profilePic !== "string" ||
    profilePic.length > 3000000 ||
    !profilePicPattern.test(profilePic)
  ) {
    return res.status(400).json({ error: "Use a valid image under 2 MB" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic },
      { new: true, runValidators: true }
    ).select("_id email name profilePic");

    return res.status(200).json({
      ...user.toObject(),
      profilePic: profilePictureUrl(req, user._id),
    });
  } catch (error) {
    return res.status(400).json({ error: "Unable to update profile picture" });
  }
};

const updateProfile = async (req, res) => {
  const { name, currentPassword, newPassword, profilePic } = req.body;
  const updates = {};

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim() || name.trim().length > 50) {
      return res.status(400).json({ error: "Name must be between 1 and 50 characters" });
    }
    updates.name = name.trim();
  }

  if (newPassword !== undefined || currentPassword !== undefined) {
    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      !currentPassword ||
      !validator.isStrongPassword(newPassword)
    ) {
      return res.status(400).json({ error: "Enter your current password and a strong new password" });
    }

    const user = await User.findById(req.user._id).select("password");
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatches) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    updates.password = await bcrypt.hash(newPassword, 10);
  }

  if (profilePic !== undefined) {
    if (
      typeof profilePic !== "string" ||
      profilePic.length > 3000000 ||
      !/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/]+=*$/.test(profilePic)
    ) {
      return res.status(400).json({ error: "Use a valid image under 2 MB" });
    }
    updates.profilePic = profilePic;
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: "No profile changes supplied" });
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("_id email name profilePic").lean();

    const contactUpdates = {};
    if (updates.name) {
      contactUpdates["chats.$[chat].userInfo.name"] = user.name;
    }
    if (updates.profilePic !== undefined) {
      contactUpdates["chats.$[chat].userInfo.profilePic"] = user.profilePic;
    }

    if (Object.keys(contactUpdates).length) {
      await UserChat.updateMany(
        { "chats.userInfo.Id": req.user._id },
        { $set: contactUpdates },
        { arrayFilters: [{ "chat.userInfo.Id": req.user._id }] }
      );
    }

    return res.status(200).json({
      ...user,
      profilePic: user.profilePic ? profilePictureUrl(req, user._id) : "",
    });
  } catch (error) {
    return res.status(400).json({ error: "Unable to update profile" });
  }
};

const searchUser = async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

  if (!name || name.length > 50) {
    return res.status(400).json({ error: "A search name is required" });
  }

  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  try {
    const users = await User.find(
      { name: { $regex: escapedName, $options: "i" } },
      { name: 1 }
    ).limit(20).lean();

    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: "No users found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params._id)
      .select("_id name profilePic")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      profilePic: user.profilePic ? profilePictureUrl(req, user._id) : "",
    });
  } catch (error) {
    return res.status(400).json({ error: "Invalid user" });
  }
};

const getProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.params._id).select("profilePic").lean();
    const match = user?.profilePic?.match(/^data:image\/([^;]+);base64,(.+)$/);

    if (!match) {
      return res.status(404).end();
    }

    res.set("Cache-Control", "public, max-age=300");
    res.type(`image/${match[1]}`);
    return res.send(Buffer.from(match[2], "base64"));
  } catch (error) {
    return res.status(404).end();
  }
};

module.exports = {
  signupUser,
  loginUser,
  searchUser,
  updateProfilePicture,
  updateProfile,
  getUserProfile,
  getProfilePicture,
};
