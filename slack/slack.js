const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const app = express();
let namespaces = require("./data/namespaces");

app.use(express.static(path.join(__dirname, "/public")));

const expressServer = app.listen(3000);
const io = socketio(expressServer);

namespaces.forEach(function (namespace) {
  io.of(namespace.endpoint).on("connection", function (nsSocket) {
    const usernames = nsSocket.handshake.query.username;
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
    nsSocket.emit("nsRoomLoad", namespace.rooms);
    nsSocket.on("joinRoom", async (roomToJoin, newNumberOfMemberCallback) => {
      //new method
      //const ids = await io.of("/wiki").on(roomToJoin).allSockets();

      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);

      nsSocket.join(roomToJoin);

      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });
      console.log(nsRoom);
      nsSocket.emit("historyCatchUp", nsRoom.history);
      updateUsersInRoom(namespace, roomToJoin);

      // console.log(nsRoom);
    });
    nsSocket.on("messageToServer", (message) => {
      const fullMsg = {
        text: message.text,
        time: Date.now(),
        username: usernames,
        avatar: "https://via.placeholder.com/30",
      };
      console.log("received message", message);
      const roomTitle = Object.keys(nsSocket.rooms)[1];

      console.log(roomTitle);
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });
      nsRoom.addMessage(fullMsg);
      io.of(namespace.endpoint).to(roomTitle).emit("messageToClients", fullMsg);
    });
  });
});

io.on("connection", (socket) => {
  const nsData = namespaces.map((namespace) => {
    return {
      nsImg: namespace.img,
      endpoint: namespace.endpoint,
    };
  });
  // console.log(nsData);
  socket.emit("nslist", nsData);
});

function updateUsersInRoom(namespace, roomToJoin) {
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .clients((error, clients) => {
      console.log(`There are ${clients.length} in this room`);
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .emit("updateMembers", clients.length);
    });
}
