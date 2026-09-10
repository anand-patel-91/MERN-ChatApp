const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const messageRoutes = require("./routes/messages");
const userRoutes = require("./routes/user");
const userChatRoutes = require("./routes/userChats");

const app = express();
const port = process.env.PORT || 4000;

if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
  throw new Error("JWT_SECRET and MONGODB_URI must be set in server/.env");
}

app.use(express.json({ limit: "10kb" }));
app.use(cors());

app.use("/api/messages", messageRoutes);

app.use("/api/user", userRoutes);

app.use("/api/userChats", userChatRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log("connected to db and listening on port", port);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
