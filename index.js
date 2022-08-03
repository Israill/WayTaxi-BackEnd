const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error.middleware');
require("dotenv").config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(require("./routes/index"));
app.use(errorMiddleware);



const start = async () => {
  try {
    mongoose.connect(process.env.MONGO_SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    app.listen(process.env.PORT, () => {
    console.log("сервер запущен");
  });
  } catch (error) {
    console.log(error)
  }
}
start()