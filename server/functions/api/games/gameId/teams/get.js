let mongoose = require ("mongoose");
let teams = require ("../../../../../schema/teams.js").model;
let gameExists = require ("../../../../../functions/gameExists.js");

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app) => {
	app.get ("/api/games/:gameId/teams", (req, res) => {
		if (!req.params.gameId) {
			res.json ({
				success: false,
				error: "No gameID specified"
			});
		} else {
			let promise = new Promise ((resolve, reject) => {
				let entries = [];
				teams.find ({appliedGame: req.params.gameId}, (err, result) => {
					if (err) {
						reject (err.toString ());
					} else {
						if (result) {
							for (let i = 0; i < result.length; i++) {
								let entry = result [i].toObject ();
								delete entry.appliedGame;
								delete entry.__v;
								entry.approved = false;
								entries.push (entry);
							}
						}
						resolve (entries);
					}
				});
			}).then ((entries) => {
				return new Promise ((resolve, reject) => {
					let gameExistsP = gameExists (req.params.gameId)
						.then ((game) => {
							for (let elem of game.teams) {
								let entry = elem.toObject ();
								delete entry.__v;
								delete entry.roundPoints;
								entry.approved = true;
								entries.push (entry);
							}
							resolve (entries);
						}).catch ((err) => {
							reject (err);
						});
				});
			}).then ((entries) => {
				return new Promise ((resolve, reject) => {
					if (entries.length > 0) {
						res.json (entries);
						resolve ();
					} else {
						reject ("No teams have applied yet");
					}
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