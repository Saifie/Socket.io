const form = document.getElementById("form");
const mes = document.getElementById("mes");
const ul = document.getElementById("ul");

var socket = io("http://localhost:3000", {
  transports: ["websocket", "polling", "flashsocket"],
});
socket.on("messageFromServer", (event) => {});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("messageToServer", { text: mes.value });
  mes.value = null;
});
socket.on("messageToEveryClient", (event) => {
  console.log(event.data);
  const newLi = document.createElement("li");
  newLi.setAttribute("class", "list-group-item");
  newLi.innerHTML += event.data;
  ul.appendChild(newLi);
});
