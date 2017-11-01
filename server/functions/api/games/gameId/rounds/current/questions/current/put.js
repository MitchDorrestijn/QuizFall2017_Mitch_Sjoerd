let mongoose = require ("mongoose");
let gameExists = require ("../../../../../../../../functions/gameExists.js");

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app, io) => {
	app.put ("/api/games/:gameId/rounds/current/questions/current", (req, res) => {
		if (!req.params.gameId) {
			res.json ({
				success: false,
				error: "No game ID specified"
			});
		} else if (!req.body.hasOwnProperty ('close')) {
			res.json ({
				success: false,
				error: "No close flag specified"
			});
		} else {
			let promise = gameExists (req.params.gameId)
				.then ((game) => {
					return new Promise ((resolve, reject) => {
						let roundId = game.activeRound;
						if (roundId !== null) {
							let activeAnswer = game.rounds [roundId].activeAnswer;
							if (activeAnswer !== null) {
								if (req.body.close) {
									if (game.rounds [roundId].answers [activeAnswer].closed) {
										reject ("Question is already closed");
									} else {
										game.rounds [roundId].answers [activeAnswer].closed = true;
										game.playedQuestions.push (game.rounds [roundId].answers [activeAnswer].question);
										resolve (game);
									}
								} else {
									reject ("You cannot reopen a question");
								}
							} else {
								reject ("There is no active question");
							}
						} else {
							reject ("Round doesn't exist");
						}
					});
				}).then ((game) => {
					return new Promise ((resolve, reject) => {
						game.save ((err) => {
							if (err) {
								reject (err.toString ());
							} else {
								for (let elem of game.teams) {
									io.of (`/ws/${req.params.gameId}/teams/${elem._id}`).emit ('closeQuestion', {closeQuestion: true});
								}
								io.of (`/ws/${req.params.gameId}/scores`).emit ('updateScore', {updateScore: true});
								resolve ();
							}
						})
					});
				}).then (() => {
					res.json ({
						success: true,
						error: null
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