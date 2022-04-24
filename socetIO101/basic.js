const http = require("http");
const socketio = require("socket.io");
const server = http.createServer((req, res) => {
  res.end("Hey I'm connected");
});

const io = socketio(server);

io.on("connection", (socket, req) => {
  socket.emit("welcome", "Welcome to the server");

  socket.on("message", (mes) => {
    console.log(mes);
  });
});

server.listen(8000);
