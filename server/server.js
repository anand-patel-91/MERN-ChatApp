const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
require("dotenv").config();
const messageRoutes = require("./routes/messages");
const userRoutes = require("./routes/user");
const userChatRoutes = require("./routes/userChats");

const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/messages", messageRoutes);

app.use("/api/user", userRoutes);

app.use("/api/userChats", userChatRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("connected to db and listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
