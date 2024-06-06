const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
require("dotenv").config();
const messageRoutes = require("./routes/messages");
const userRoutes = require("./routes/user");
const userChatRoutes = require("./routes/userChats");

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', (req, res)=> {
    res.send("Server is running");
})

app.use("/api/messages", messageRoutes);

app.use("/api/user", userRoutes);

app.use("/api/userChats", userChatRoutes);

mongoose
  .connect(REACT_APP_MONGO_URI)
  .then(() => {
    app.listen(REACT_APP_PORT, () => {
      console.log("connected to db and listening on port", REACT_APP_PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
