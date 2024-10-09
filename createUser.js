const UserLogin = require("./models/userLogin");
// register user using createUser function
async function createUser(username, email, password) {
	UserLogin.findOne({ username: username })
		.then((res) => {
			if (res) {
				throw Error("user exists, exiting");
			} else {
				new UserLogin({
					username: username,
					email: email,
					password: password,
				})
					.save()
					.then((res) => console.log("account created:", res))
					.catch((err) =>
						console.log("err happened when creating account:", err)
					);
			}
		})
		.catch((err) =>
			console.log(`error fetching username data from db ${err}`)
		);
}

module.exports = createUser;
