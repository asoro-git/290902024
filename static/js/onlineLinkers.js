let existingPlayerId = [];

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

  console.log(existingPlayerId);
  if (!existingPlayerId.includes(data.userId)) {
    console.log(existingPlayerId);
    let playerList = document.getElementById("player-list");
    let playerItem = document.createElement("li");
    let playerLink = document.createElement("a");
    let strongEl = document.createElement("strong");

    playerItem.classList.add("nav-item");
    playerLink.href = "#";
    playerLink.classList.add("nav-link", "text-center");
    strongEl.innerText = data.userName.toString();
    strongEl.id = data.userId.toString();

    playerLink.appendChild(strongEl);

    playerItem.appendChild(playerLink);
    playerList.appendChild(playerItem);
    existingPlayerId.push(data.userId);
    console.log(existingPlayerId);
  } else {
    let item = document.getElementById(data.userId.toString());
    console.log(data.userName.toString());
    item.innerText = data.userName.toString();
  }

  //     <li class="nav-item">
  //            <a href="#" class="nav-link text-center">
  //       <!--player name here-->test</a
  //            >
  //     </li>
});

socket.on("disconnected player", (data) => {
  console.log(data.userId.toString());
  let item = document.getElementById(data.userId.toString());
  console.log(item);
  let playerLink = item.parentNode;
  let playerItem = playerLink.parentNode;
  let playerList = playerItem.parentNode;
  playerList.removeChild(playerItem);
});
