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
          default: "",
        },
        attachment: {
          name: {
            type: String,
            maxlength: 200,
          },
          type: {
            type: String,
            maxlength: 100,
          },
          size: {
            type: Number,
            max: 5242880,
          },
          data: {
            type: String,
            maxlength: 7200000,
          },
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
