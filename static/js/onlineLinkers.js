clientSideExistingPlayerName = [];
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
	console.log(
		"player list data received: ",
		data.existngPlayerName,
		existingPlayerId,
		data.userId
	);
	let i = 0;
	data.existngPlayerName.forEach((playerName) => {
		if (!clientSideExistingPlayerName.includes(playerName)) {
			console.log(playerName, "creating ID");
			let playerList = document.getElementById("player-list");
			let playerItem = document.createElement("li");
			let playerLink = document.createElement("a");
			let strongEl = document.createElement("strong");

			playerItem.classList.add("nav-item");
			playerLink.href = "#" + existingPlayerId[i];
			playerLink.classList.add("nav-link", "text-center");
			strongEl.innerText = playerName;

			strongEl.id = existingPlayerId[i];

			playerLink.appendChild(strongEl);
			playerItem.appendChild(playerLink);
			playerList.appendChild(playerItem);

			console.log(i, existingPlayerId[i]);
			clientSideExistingPlayerName.push(playerName);
			clientSideExistingPlayerId.push(existingPlayerId[i]);
			i++;
		} else {
			i++;
		}
	});
});

//     <li class="nav-item">
//            <a href="#" class="nav-link text-center">
//       <!--player name here-->test</a
//            >
//     </li>

socket.on("disconnected player", (data) => {
	console.log(data.__userId.toString());

	if (clientSideExistingPlayerId.includes(data.__userId.toString())) {
		let item = document.getElementById(data.__userId.toString());
		console.log(item.innerText);
		clientSideExistingPlayerName = clientSideExistingPlayerName.filter(
			(e) => e != item.innerText.toString()
		);
		let playerLink = item.parentNode;
		let playerItem = playerLink.parentNode;
		let playerList = playerItem.parentNode;
		playerList.removeChild(playerItem);
		lientSideExistingPlayerId = clientSideExistingPlayerId.filter(
			(e) => e != data.__userId.toString()
		);
	}
});
