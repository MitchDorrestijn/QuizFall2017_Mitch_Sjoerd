let mongoose = require ("mongoose");
let gameExists = require ("../../../../../../../../functions/gameExists.js");
let questions = require ("../../../../../../../../schema/questions.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app) => {
	app.get ("/api/games/:gameId/rounds/current/questions/current", (req, res) => {
		if (!req.params.gameId) {
			res.json ({
				success: false,
				error: "No game ID specified"
			});
		} else {
			let promise = gameExists (req.params.gameId)
				.then ((game) => {
					return new Promise ((resolve, reject) => {
						let roundId = game.activeRound;
						if (roundId !== null) {
							let activeAnswer = game.rounds [roundId].activeAnswer;
							if (activeAnswer !== null) {
								resolve (game.rounds [roundId].answers [activeAnswer].question);
							} else {
								reject ("No question is active");
							}
						} else {
							reject ("Round doesn't exist");
						}
					});
				}).then ((questionId) => {
					return new Promise ((resolve, reject) => {
						questions.findOne ({_id: questionId}, (err, result) => {
							if (err) {
								reject (err.toString ());
							} else if (result) {
								resolve ({
									question: result.question
								});
							} else {
								reject ("Question not found");
							}
						});
					});
				}).then ((result) => {
					res.json (result);
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