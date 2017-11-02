let mongoose = require ("mongoose");
let gameExists = require ("../../../gameExists.js");
let calculateScores = require ("../../../calculateScores.js");

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app, io) => {
	app.put ("/api/games/:gameId", (req, res) => {
		if (!req.body.hasOwnProperty ('closed')) {
			res.send ({
				success: false,
				error: "No closed flag specified"
			});
		} else if (!req.params.gameId) {
			res.send ({
				success: false,
				error: "No game ID specified"
			});
		} else {
			let promise = gameExists (req.params.gameId)
				.then ((game) => {
					return new Promise ((resolve, reject) => {
						if (req.body.closed) {
							if (game.activeRound !== null) {
								let roundId = game.activeRound;
								let activeAnswer = game.rounds [roundId].activeAnswer;
								if (game.rounds [roundId].activeAnswer !== null) {
									game.playedQuestions.push (game.rounds [roundId].answers [activeAnswer].question);
									game.rounds [roundId].activeAnswer = null;
								}
								game = calculateScores (game);
								game.activeRound = null;
							}
							game.closed = true;
							game.save ((err) => {
								if (err) {
									reject (err.toString ());
								} else {
									for (let elem of game.teams) {
										io.of (`/ws/${req.params.gameId}/teams/${elem._id}`).emit ('closeGame', {closeGame: true});
									}
									io.of (`/ws/${req.params.gameId}/scores`).emit ('updateScore', {updateScore: true});
									resolve ();
								}
							});
						} else {
							reject ("This game is already open");
						}
					});
				}).then (() => {
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