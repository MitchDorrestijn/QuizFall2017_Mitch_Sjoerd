let mongoose = require ("mongoose");
let randomstring = require ("randomstring");
let games = require ("../../../schema/games.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app, io) => {
	app.post ("/api/games", (req, res) => {
		let password;
		let firstRound = true;
		loop = () => {
			password = randomstring.generate (7);
			let promise = new Promise ((resolve, reject) => {
				games.findOne ({_id: password}, (err, result) => {
					if (err) {
						reject (err.toString ());
					} else {
						if (!result) {
							resolve ();
						} else {
							reject (null);
						}
					}
				})
			}).then (() => {
				return new Promise ((resolve, reject) => {
					let game = new games ({_id: password});
					game.save ((err) => {
						if (err) {
							reject (err.toString ());
						} else {
							resolve ();
						}
					});
				});
			}).then (() => {
				res.json ({
					success: true,
					error: null,
					password: password
				});
				io.of (`/ws/${password}/master`).on ('connection', (socket) => {
					socket.emit ('connected', {connected: true});
				});
				io.of (`/ws/${password}/scores`).on ('connection', (socket) => {
					socket.emit ('connected', {connected: true});
				});
			}).catch ((err) => {
				if (err) {
					res.send ({
						success: false,
						error: err
					});
				} else {
					loop ();
				}
			});
		};
		if (firstRound) {
			firstRound = false;
			loop ();
		}
	});
};

module.exports = api;