if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
//require all the packages, call using constName.function(var)
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const UserLogin = require("./models/userLogin");
const bcrypt = require("bcryptjs");
const createUser = require("./createUser");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

// passport modules
const passport = require("passport");
const initializePassport = require("./passport-config");

// check authentication
function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect("/");
	}
	next();
}

// start a http server
const app = express();
const server = http.createServer(app);

// send server details to socketIo and establish socket server
const io = socketIo(server);

// connect to mongoose
const mongoose = require("mongoose");
const { hostname } = require("os");

// console.log(
// 	UserLogin.find({ userName: "admin" })
// 		.then((res) => console.log(res.length))
// 		.catch((err) => console.log(`error:${err}`))
// );

// 	let userCreated = new UserLogin({
// 		username: username,
// 		password: password,
// 	});
// 	userCreated
// 		.save()
// 		.then(console.log(userCreated))
// 		.catch((err) => console.log(err));

// make ejs as view engine
app.set("view-engine", "ejs");

//passports
initializePassport(passport, async (id) => await UserLogin.find({ _id: id }));
// express-session for passport
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(flash()); // display error messages using ejs
app.use(passport.initialize()); //
app.use(passport.session());
app.use(methodOverride("_method")); // in html put in ?_method=DELETE, do not need to stringify DELETE, this is used so you custom make HTML's request, when it sends post request using a form to logout user, it is interpreted as DELETE method in express app

app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: false }));

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("mongodb connected"))
	.catch((err) => console.log(err));

let playerCount = 0;
let userName;
let existingPlayerId = [];
let existngPlayerName = [];
// express serves files to front end, front end file should contain socket.js and const socket = io()
app.get("/", async (req, res) => {
	let user = await req.user;
	if (user) {
		console.log(user[0].username);
		userName = user[0].username;
		if (!existngPlayerName.includes(userName)) {
			existngPlayerName.push(userName);
		}
		res.render(path.join(__dirname, "index.ejs"), {
			userName: user[0].username,
		});
	} else {
		res.render(path.join(__dirname, "index.ejs"), {
			userName: undefined,
		});
	}
});

app.get("/character", checkAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, "character.html"));
});

app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/",
		successFlash: true,
		failureRedirect: "/login",
		failureFlash: true,
	})
);

app.get("/login", async (req, res) => {
	let user = await req.user;
	if (user) {
		userName = user[0].username;
		res.render(path.join(__dirname, "login.ejs"), {
			message: req.flash(),
			userName,
		});
	} else {
		res.render(path.join(__dirname, "login.ejs"), {
			message: req.flash(),
			userName: undefined,
		});
	}
});

app.post("/register", async (req, res) => {
	try {
		let username = req.body.username;
		let email = req.body.email;
		let password = await bcrypt.hash(req.body.password, 10);
		console.log(password);
		createUser(username, email, password)
			.then(res.redirect("/login"))
			.catch(() => res.redirect("/register"));
	} catch {
		(err) => {
			console.log(err);
			res.redirect("/register");
		};
	}
});

app.delete("/logout", checkAuthenticated, async (req, res, next) => {
	if (req.isAuthenticated()) {
		let user = await req.user;
		console.log("logging out", user[0].username);

		existngPlayerName = existngPlayerName.filter(
			(name) => name !== user[0].username
		);

		req.logout(async (err) => {
			if (err) {
				return next(err);
			}
			req.flash("success", "Logged out successfully!");
			res.redirect("/login");
		});
		console.log("playerlist updated: ", existngPlayerName);
	}
});
app.get("/register", checkNotAuthenticated, async (req, res) => {
	let user = await req.user;
	if (user) {
		userName = user[0].username;
		res.render(path.join(__dirname, "/register.ejs"), {
			message: req.flash(),
			userName,
		});
	} else {
		res.render(path.join(__dirname, "/register.ejs"), {
			message: req.flash(),
			userName: undefined,
		});
	}
});

app.get("/sidebar", checkAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, "sidebar.html"));
});

app.get("/roadmap", checkAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, "roadmap.html"));
});

app.get("/pomodoro", checkAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, "pomodoro.html"));
});

// after serving files to front end, io start listening to message sent from front end
// console log if mutual channel has been established
// io receive signal from frontend, create connection and disconnection messages
io.on("connection", (socket) => {
	console.log(`user ${socket.id} connected.`);
	const userId = socket.id;
	existingPlayerId.push(userId);
	playerCount += 1;
	console.log(
		"playerlist sending:...",
		existngPlayerName,
		existingPlayerId,
		playerCount
	);
	_userName =
		userName ||
		["Lost Soul", "Wanderer", "Someone", "Quiet Bird"][
			Math.floor(Math.random() * 4)
		];
	console.log("your user name is", userName, _userName);
	io.emit("online players", { playerCount });
	io.emit("player list", {
		existngPlayerName,
		userId,
		existingPlayerId,
	});
	io.emit("username", { _userName });
	socket.on("name change", (data) => {
		let userName = data.userName;
		console.log("sever received name change event", userName);
		io.emit("player list", { userName, userId });
		console.log("server emitted name change", data);
	});
	socket.on("chat message", (data) => {
		let _userName = data.userName;
		let _message = data.message;
		let _choking_message = `<h1>*Gulp...*</h1> ${_userName} suddenly choked on their own saliva. You hear some murmurs, mocking ${_userName}'s lack of eloquence. Be careful, ${_userName}! Promise me this is your last time.`;
		if (_message == "") {
			_message = _choking_message;
		}
		console.log(data.userName, data.message, data.messageCount);
		io.emit("chat message", { _userName, _message, _choking_message });
	});
	socket.onAny((event, ...args) => {
		const logMessage = `Client: ${
			socket.id
		}, Event: ${event}, Args: ${JSON.stringify(args)}\n`;
		console.log(logMessage);
	});
	socket.on("send help message", () => {
		socket.emit(
			"help message",
			`
      </span>
      <div class="container" style="width: 100%">
      <center>
      <h1> HELP MENU </h1>
      <br>Below are commands available at the moment 
      <br>
      <table>
      <td>
      <li>/bigger to make your text bigger</li>
      <li>press the \` key on keyboard to scroll to bottom of chat</li>
      <li>Change name using navbar dropdown menu</li>
      <li>in-chat help function, type /help into chat to look at this page again</li>
      </ul>
      <br><strong>Features to be added</strong>
      <ul>
      <li>login page</li>
      <li>pomodoro clock</li>
      <li>offline hunting</li>
      <li>idle leveling</li>
      <li>profile page</li>
      <li>adventure page</li>
      <li>inventory</li>
      <li>move alert logics to server side when possible</li>
      <li>server authenticate socket events</li>
      <li>weather system based on server world time</li>
      <li>server/ world time system</li>
      <li>and more... please stay tunned...</li>
      </ul>
      <ul><strong>Road Map</strong>
      <li>Vanilla JS Program</li>
      <li>?Nextjs/ EJS Framework</li>
      <li>React rebuild</li>
      </ul>
      </td>
      </table>
      </div>
      </center>
      <span>
      `
		);
	});

	console.log(playerCount);
	socket.on("disconnect", () => {
		let __userId = socket.id;
		console.log(__userId);
		console.log(`user ${__userId} has disconnected.`);
		playerCount -= 1;
		io.emit("online players", { playerCount });
		io.emit("disconnected player", { __userId });
		console.log(__userId);
		existingPlayerId = existingPlayerId.filter(
			(item) => item != __userId.toString()
		);
		console.log(existingPlayerId, playerCount);
		io.emit("player list", {
			existngPlayerName,
			userId,
			existingPlayerId,
		});
	});
});

// //io emit data to frontend

const PORT = process.env.PORT || 3000; // Fallback to 3000 for local dev
server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
