const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userChatSchema = new Schema(
  {
    Id: {
      type: Schema.Types.ObjectId ,
      required: true,
      unique: true,
    },
    chats: [
      {
        chatId: {
          type: String,
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
          Id: {
            type: Schema.Types.ObjectId ,
            required: true,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserChat", userChatSchema);
