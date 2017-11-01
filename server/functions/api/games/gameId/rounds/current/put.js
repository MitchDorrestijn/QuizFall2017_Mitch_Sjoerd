let mongoose = require ("mongoose");
let gameExists = require ("../../../../../../functions/gameExists.js");

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app, io) => {
	app.put ("/api/games/:gameId/rounds/current", (req, res) => {
		if (!req.params.gameId) {
			res.json ({
				success: false,
				error: "No game ID specified"
			});
		} else if (!req.body.nextQuestion) {
			res.json ({
				success: false,
				error: "No question or close flag specified"
			});
		} else if (req.body.nextQuestion) {
			let promise = gameExists (req.params.gameId)
				.then ((game) => {
					return new Promise ((resolve, reject) => {
						let roundId = game.activeRound;
						if (roundId !== null) {
							let activeAnswer = game.rounds [roundId].activeAnswer;
							if (activeAnswer !== null) {
								let activeQuestion = game.rounds [roundId].answers [activeAnswer];
								if (activeQuestion.closed) {
									game.playedQuestions.push (activeQuestion.question);
									let success = false;
									for (let i = 0; i < game.rounds [roundId].answers.length; i++) {
										if (game.rounds [roundId].answers [i].question.toString () === req.body.nextQuestion) {
											game.rounds [roundId].activeAnswer = i;
											success = true;
										}
									}
									if (success) {
										resolve (game);
									} else {
										reject ("Couldn't change to new question");
									}
								} else {
									reject ("Current question must be closed before you can move on");
								}
							} else {
								let success = false;
								for (let i = 0; i < game.rounds [roundId].answers.length; i++) {
									if (game.rounds [roundId].answers [i].question.toString () === req.body.nextQuestion) {
										game.rounds [roundId].activeAnswer = i;
										success = true;
									}
								}
								if (success) {
									resolve (game);
								} else {
									reject ("Couldn't change to new question");
								}
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
									io.of (`/ws/${req.params.gameId}/teams/${elem._id}`).emit ('changeQuestion', {changeQuestion: true});
								}
								io.of (`/ws/${req.params.gameId}/scores`).emit ('updateScore', {updateScore: true});
								resolve ();
							}
						});
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