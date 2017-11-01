let mongoose = require ("mongoose");
let gameExists = require ("../../../../../../functions/gameExists.js");

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app) => {
	app.get ("/api/games/:gameId/teams/:teamId", (req, res) => {
		if (!req.params.gameId) {
			res.json ({
				success: false,
				error: "No game ID specified"
			});
		} else if (!req.params.teamId) {
			res.json ({
				success: false,
				error: "No team ID specified"
			});
		} else {
			let promise = gameExists (req.params.gameId)
				.then ((game) => {
					return new Promise ((resolve, reject) => {
						let approved = false;
						for (elem of game.teams) {
							if (elem._id.toString () === req.params.teamId) {
								approved = true;
							}
						}
						resolve (approved);
					});
				}).then ((value) => {
					res.json ({
						approved: value
					});
				}).catch ((err) => {
					res.json ({
						success: false,
						error: err
					});
				});
		}
	});
};

module.exports = api;