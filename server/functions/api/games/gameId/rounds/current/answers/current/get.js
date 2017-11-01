let mongoose = require ("mongoose");
let gameExists = require ("../../../../../../../../functions/gameExists.js");
let questions = require ("../../../../../../../../schema/questions.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app) => {
	app.get ("/api/games/:gameId/rounds/current/answers/current", (req, res) => {
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
						if (game.activeRound !== null) {
							let activeAnswer = game.rounds [roundId].activeAnswer;
							if (activeAnswer !== null) {
								let result = {};
								result.answer = null;
								result.questionId = game.rounds [roundId].answers [activeAnswer].question;
								result.teamAnswers = [];
								for (let elem of game.rounds [roundId].answers [activeAnswer].answers) {
									if (elem.answer !== "") {
										result.teamAnswers.push (elem);
									}
								}
								resolve (result);
							} else {
								reject ("No question is active");
							}
						} else {
							reject ("Round doesn't exist");
						}
					});
				}).then ((result) => {
					return new Promise ((resolve, reject) => {
						let questionId = result.questionId;
						delete result.questionId;
						questions.findOne ({_id: mongoose.Types.ObjectId (questionId)}, (err, result2) => {
							if (err) {
								reject (err.toString ());
							} else if (result2) {
								result.answer = result2.answer;
								resolve (result);
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