const User = require("../models/userModel");

const getContacts = async (req, res) => {
  const messages = await User.find({ _id: { $nin: [req.user] } });

  res.status(200).json(messages);
};

module.exports = getContacts;
