const LocalStrategy = require("passport-local").Strategy;
const { serializeUser, deserializeUser } = require("passport");
const UserLogin = require("./models/userLogin");
const bcrypt = require("bcrypt");

function initializePassport(passport, getUserById) {
	const authenticateUser = async (username, password, done) => {
		const user = await UserLogin.findOne({ username: username });
		if (!user) {
			return done(null, false, { message: "User not found!" });
		}

		try {
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user, { message: "Welcome!!!" });
			} else {
				return done(null, false, {
					message: "Incorrect password",
				});
			}
		} catch (err) {
			return done(err);
		}
	};
	passport.use(
		new LocalStrategy(
			{
				usernameField: "username",
				passwordField: "password",
			},
			authenticateUser
		)
	);
	passport.serializeUser((user, done) => {
		console.log("serializing", user, user.username, user._id);
		done(null, user._id);
	});
	passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

module.exports = initializePassport;
