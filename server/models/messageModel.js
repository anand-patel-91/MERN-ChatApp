const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    chatId: {
      type: String,
    },
    messages: [
      {
        content: {
          type: String,
          required: true,
        },
        senderId: {
          type: Schema.Types.ObjectId ,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
