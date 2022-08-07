const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const ws = require('ws')
const errorMiddleware = require('./middlewares/error.middleware');
require("dotenv").config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(require("./routes/index"));
app.use(errorMiddleware);

const wss = new ws.Server({
  port: 4100,
}, () => console.log(`Server started on 4100`))

wss.on('connection', function connection(ws) {
  ws.on('message', function (message) {
    message = JSON.parse(message);
    switch (message.event) {
      case 'message':
        broadcastMessage(message)
        break
      case 'connection': 
        broadcastMessage(message)
        break
    }
  })
});

function broadcastMessage(message) {
  wss.clients.forEach(client => {
    client.send(JSON.stringify(message))
  })
};

const message = {
  event: 'message/connection',
  id: 123,
  date: Date.now(),
  username: 'Emin',
  message: '',
}

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