let mongoose = require ("mongoose");
let gameExists = require ("../../../../../functions/gameExists.js");
let calculateScores = require ("../../../../../functions/calculateScores.js");

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app, io) => {
	app.post ("/api/games/:gameId/rounds", (req, res) => {
		if (!req.params.gameId) {
			res.json ({
				success: false,
				error: "No game ID specified"
			});
		} else {
			let promise = gameExists (req.params.gameId)
				.then ((game) => {
					return new Promise ((resolve, reject) => {
						if (game.teams.length > 1) {
							let round = {
								answers: [],
								activeAnswer: null
							};
							if (game.activeRound !== null) {
								game = calculateScores (game);
							}
							game.rounds.push (round);
							let roundNumber = game.rounds.length - 1;
							game.activeRound = roundNumber;
							game.save ((err) => {
								if (err) {
									reject (err);
								} else {
									for (let elem of game.teams) {
										io.of (`/ws/${req.params.gameId}/teams/${elem._id}`).emit ('changeRound', {changeRound: true});
									}
									io.of (`/ws/${req.params.gameId}/scores`).emit ('updateScore', {updateScore: true});
									resolve (roundNumber);
								}
							});
						} else {
							reject ("You need at least two teams to start a round");
						}
					});
				}).then ((roundNumber) => {
					res.json ({
						success: true,
						error: null,
						roundId: roundNumber
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