const form = document.getElementById("form");
const mes = document.getElementById("mes");
const ul = document.getElementById("ul");
const user = prompt("Whats Your Name");

let socket = io("http://localhost:3000", {
  transports: ["websocket", "polling", "flashsocket"],
  query: {
    username: user,
  },
});

let nsSocket = "";
/*for /  route  main */
socket.on("nslist", (event) => {
  const namespaceDiv = document.querySelector(".namespaces");
  event.forEach((ns) => {
    namespaceDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}">
    <img
      src='${ns.nsImg}'
  </div>`;
  });

  const namespaces = Array.from(document.getElementsByClassName("namespace"));
  namespaces.forEach((namespace) => {
    namespace.addEventListener("click", (e) => {
      const nameEntpont = namespace.getAttribute("ns");
      join(nameEntpont);
    });
  });
  join("/wiki");
});
