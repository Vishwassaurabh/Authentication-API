const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const UserRouter = require("./routes/usersRouter");
const errorHandler = require("./middlewares/errorHandler");

//! Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((e) => {
    console.log(e);
  });
//! Middleware
app.use(express.json()); //pass incoming json data

//! router
app.use("/", UserRouter);

//! error handler
app.use(errorHandler);

//! start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
