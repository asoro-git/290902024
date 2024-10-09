const mongoose = require("mongoose");
const userLoginSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		lowercase: true,
		multi: false,
	},
	email: { type: String, required: true, lowercase: true, multi: false },
	password: { type: String, required: true },
});

const UserLogin = mongoose.model("Userlogin", userLoginSchema);

module.exports = UserLogin;
