let mongoose = require ("mongoose");
let gameExists = require ("../../../../../../../functions/gameExists.js");
let questions = require ("../../../../../../../schema/questions.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app, questionsPerRound) => {
	app.post ("/api/games/:gameId/rounds/current/questions", (req, res) => {
		if (!req.params.gameId) {
			res.json ({
				success: false,
				error: "No game ID specified"
			});
		} else if (!req.body.categories) {
			res.json ({
				success: false,
				error: "No game ID specified"
			});
		} else if (req.body.categories.length < 3) {
			res.json ({
				success: false,
				error: "You need to specify three categories"
			});
		} else {
			let promise = gameExists (req.params.gameId)
				.then ((game) => {
					return new Promise ((resolve, reject) => {
						if (game.activeRound !== null) {
							if (game.rounds [game.activeRound].answers.length > 0) {
								reject ("You've added questions to this round");
							} else {
								resolve (game);
							}
						} else {
							reject ("There's no active round");
						}
					});
				}).then ((game) => {
					return new Promise ((resolve, reject) => {
						questions.findRandom (
							{_id: { $nin: game.playedQuestions }, category: { $in: req.body.categories }},
							{},
							{limit: questionsPerRound},
							(err, result) => {
								if (err) {
									reject (err.toString ());
								} else {
									let gameAndQuestions = [game, result];
									resolve (gameAndQuestions);
								}
							});
					});
				}).then ((gameAndQuestions) => {
					return new Promise ((resolve, reject) => {
						let game = gameAndQuestions [0];
						let questions = gameAndQuestions [1];
						let teamAnswers = [];
						for (let elem of game.teams) {
							teamAnswers.push ({
								team: elem.name,
								answer: "",
								approved: false
							});
						}
						for (let elem of questions) {
							game.rounds [game.activeRound].answers.push ({
								question: elem._id,
								closed: false,
								answers: teamAnswers
							});
						}
						game.save ((err) => {
							if (err) {
								reject (err.toString ());
							} else {
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