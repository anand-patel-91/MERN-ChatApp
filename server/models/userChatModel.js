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
        unreadCount: {
          type: Number,
          default: 0,
          min: 0,
        },
        userInfo: {
          name: {
            type: String,
            required: true,
          },
          profilePic: {
            type: String,
            default: "",
            maxlength: 3000000,
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
