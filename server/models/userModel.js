const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.signup = async function (email, name, password) {
  email = typeof email === "string" ? email.trim().toLowerCase() : email;
  name = typeof name === "string" ? name.trim() : name;

  if (!email || !name || !password) {
    throw Error("All Fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Not a valid Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, name, password: hash });

  return user;
};

userSchema.statics.login = async function (email, password) {
  email = typeof email === "string" ? email.trim().toLowerCase() : email;

  if (!email || !password) {
    throw Error("All Fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect Password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
