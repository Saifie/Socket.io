const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const app = express();

app.use(express.static(path.join(__dirname, "/public")));

const expressServer = app.listen(3000);
const io = socketio(expressServer);

module.exports = {
  app,
  io,
};
