let mongoose = require ("mongoose");
let gameExists = require ("../../../../gameExists.js");

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app) => {
	app.get ("/api/games/:gameId/exists", (req, res) => {
		if (!req.params.gameId) {
			res.send ({
				success: false,
				error: "No game ID specified"
			});
		} else {
			let promise = gameExists (req.params.gameId)
				.then (() => {
					res.send ({
						success: true,
						error: null
					});
				}).catch ((err) => {
					res.send ({
						success: false,
						error: err
					});
				});
		}
	});
};

module.exports = api;
