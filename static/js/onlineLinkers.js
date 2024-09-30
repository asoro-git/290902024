clientSideExistingPlayerId = [];

socket.on("online players", (data) => {
  let item = document.getElementById("player-number");
  console.log(data);
  if (data.playerCount > 1) {
    item.innerText = data.playerCount.toString() + " Linkers are ";
  } else {
    item.innerText = "1 Linker is ";
  }
});

socket.on("player list", (data) => {
  console.log("received data: ", data);
  existingPlayerId = data.existingPlayerId;
  console.log(existingPlayerId, data.userId);
  data.existingPlayerId.forEach((itemId) => {
    if (!clientSideExistingPlayerId.includes(itemId)) {
      console.log(itemId, "creating ID");
      let playerList = document.getElementById("player-list");
      let playerItem = document.createElement("li");
      let playerLink = document.createElement("a");
      let strongEl = document.createElement("strong");

      playerItem.classList.add("nav-item");
      playerLink.href = "#" + itemId;
      playerLink.classList.add("nav-link", "text-center");
      strongEl.innerText = "Linker Terminal " + itemId.toString().slice(0, 3);

      strongEl.id = itemId;

      playerLink.appendChild(strongEl);
      playerItem.appendChild(playerLink);
      playerList.appendChild(playerItem);

      console.log(existingPlayerId);
      clientSideExistingPlayerId.push(itemId);
    } else {
      let strongEl = document.getElementById(itemId);
      console.log(itemId.toString());
      strongEl.innerText = "Linker Terminal " + itemId.toString().slice(0, 3);
    }
  });
});

//     <li class="nav-item">
//            <a href="#" class="nav-link text-center">
//       <!--player name here-->test</a
//            >
//     </li>
// });

socket.on("disconnected player", (data) => {
  console.log(data.__userId.toString());
  let item = document.getElementById(data.__userId.toString());
  console.log(item);
  let playerLink = item.parentNode;
  let playerItem = playerLink.parentNode;
  let playerList = playerItem.parentNode;
  playerList.removeChild(playerItem);
  clientSideExistingPlayerId.filter((e) => e != data.__userId.toString());
});
