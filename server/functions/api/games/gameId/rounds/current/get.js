let mongoose = require ("mongoose");
let gameExists = require ("../../../../../../functions/gameExists.js");

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app) => {
	app.get ("/api/games/:gameId/rounds/current", (req, res) => {
		if (!req.params.gameId) {
			res.json ({
				success: false,
				error: "No game ID specified"
			});
		} else {
			let promise = gameExists (req.params.gameId)
				.then ((game) => {
					return new Promise ((resolve) => {
						resolve (game.activeRound);
					});
				}).then ((activeRound) => {
					res.json ({
						activeRound: activeRound
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