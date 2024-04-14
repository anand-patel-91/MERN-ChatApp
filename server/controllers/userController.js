const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ email, name: user.name, token, _id:user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const user = await User.signup(email, name, password);

    const token = createToken(user._id);

    res.status(200).json({ email, name, token, _id:user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const searchUser = async (req, res) => {
  const { name } = req.body;
  try {
    const users = await User.find(
      { name: { $regex: new RegExp(name) } },
      { name: 1, _id: 1 }
    );

    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No users found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { signupUser, loginUser, searchUser };
