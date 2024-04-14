const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userChatSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    chats: [
      {
        chatId: {
          type: String,
          unique: false,
          required: true,
        },
        lastMessage: {
          type: String,
        },
        userInfo: {
          name: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserChat", userChatSchema);
