const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ email: user.email, name: user.name, profilePic: user.profilePic, token, _id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { email, name, password, profilePic } = req.body;

  try {
    const user = await User.signup(email, name, password, profilePic);

    const token = createToken(user._id);

    res.status(200).json({ email: user.email, name: user.name, profilePic: user.profilePic, token, _id: user._id });
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

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: "Unable to update profile picture" });
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
      { name: 1, profilePic: 1 }
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

module.exports = { signupUser, loginUser, searchUser, updateProfilePicture };
