let mongoose = require ("mongoose");
let gameExists = require ("../../../../../../../functions/gameExists.js");
let questions = require ("../../../../../../../schema/questions.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app) => {
	app.get ("/api/games/:gameId/rounds/current/questions", (req, res) => {
		if (!req.params.gameId) {
			res.json ({
				success: false,
				error: "No game ID specified"
			});
		} else {
			let promise = gameExists (req.params.gameId)
				.then ((game) => {
					return new Promise ((resolve, reject) => {
						if (game.activeRound !== null) {
							let roundQuestions = [];
							for (let answer of game.rounds [game.activeRound].answers) {
								roundQuestions.push ({
									questionId: answer.question
								});
							}
							let playedQuestions = game.playedQuestions.map ((elem) => {
								return elem.toString ();
							});
							roundQuestions = roundQuestions.filter (val => !playedQuestions.includes (val.questionId.toString ()));
							resolve (roundQuestions);
						} else {
							reject ("Round doesn't exist");
						}
					});
				}).then ((roundQuestions) => {
					return new Promise ((resolve, reject) => {
						let questionIds = roundQuestions.map ((elem) => {
							return elem.questionId;
						});
						questions.find ({_id: { $in: questionIds }}, (err, result) => {
							if (err) {
								reject (err.toString ());
							} else {
								let roundQuestionsAndQuestions = [roundQuestions, result];
								resolve (roundQuestionsAndQuestions);
							}
						});
					});
				}).then ((roundQuestionsAndQuestions) => {
					let roundQuestions = roundQuestionsAndQuestions [0];
					let questions = roundQuestionsAndQuestions [1];
					let result = [];
					return new Promise ((resolve, reject) => {
						for (let i = 0; i < roundQuestions.length; i++) {
							for (let j = 0; j < questions.length; j++) {
								if (roundQuestions [i].questionId.toString () === questions [j]._id.toString ()) {
									result.push ({
										questionId: roundQuestions [i].questionId,
										question: questions [j].question,
										answer: questions [j].answer
									});
								}
							}
						}
						resolve (result);
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