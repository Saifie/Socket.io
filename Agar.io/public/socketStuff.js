let socket = io("http://localhost:3000", {
  transports: ["websocket", "polling", "flashsocket"],
});
function init() {
  draw();
  socket.emit("init", {
    playerName: player.name,
  });
}

socket.on("initReturn", (event) => {
  setInterval(() => {
    socket.emit("tick", {
      xVector: player.xVector,
      yVector: player.yVector,
    });
  }, 33);
  orbs = event.orbs;
});

socket.on("tock", (event) => {
  players = event.players;
  player.locX = event.playerx;
  player.locY = event.playery;
});
