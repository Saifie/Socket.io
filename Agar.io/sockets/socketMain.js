const io = require("../server").io;
const Orb = require("./classes/Orbs");
const PlayerConfig = require("./classes/playerConfig");
const PlayerData = require("./classes/playerData");
const Player = require("./classes/player");
const checkForOrbCollisions = require("./checkCollision").checkForOrbCollisions;
const checkForPlayerCollisions =
  require("./checkCollision").checkForPlayerCollisions;

let orbs = [];
let players = [];
let settings = {
  defaultOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
};
initGame();

io.sockets.on("connect", (socket) => {
  let player = {};
  socket.on("init", (event) => {
    socket.join("game");
    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(event.playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);

    setInterval(() => {
      io.to("game").emit("tock", {
        players,
        playerx: player.playerData.locX,
        playery: player.playerData.locY,
      });
    }, 33);

    socket.emit("initReturn", { orbs });
    players.push(playerData);
  });

  socket.on("tick", (event) => {
    speed = player.playerConfig?.speed;
    xV = player.playerConfig.xvector = event?.xVector;
    yV = player.playerConfig.yvector = event?.yVector;

    if (
      (player.playerData.locX < 5 && player.playerData.xvector < 0) ||
      (player.playerData.locX > 500 && xV > 0)
    ) {
      player.playerData.locY -= speed * yV;
    } else if (
      (player.playerData.locY < 5 && yV > 0) ||
      (player.playerData.locY > 500 && yV < 0)
    ) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }
  });
});

function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}
module.exports = io;
