let mongoose = require ("mongoose");
let gameExists = require ("../../../../../functions/gameExists.js");
let questions = require ("../../../../../schema/questions.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app, questionsPerRound) => {
	app.get ("/api/games/:gameId/scores", (req, res) => {
		if (!req.params.gameId) {
			res.json ({
				success: false,
				error: "No gameID specified"
			});
		} else {
			let promise = gameExists (req.params.gameId, true)
				.then ((game) => {
					return new Promise ((resolve, reject) => {
						let result = {};
						let round = null;
						let scores = [];
						if (game.activeRound !== null) {
							round = game.rounds [game.activeRound];
						}
						for (let team of game.teams) {
							let score = {};
							score.team = team.name;
							score.roundPoints = team.roundPoints;
							if (round) {
								score.correctAnswers = 0;
								for (let answers of round.answers) {
									for (let teamAnswer of answers.answers) {
										if (teamAnswer.team === score.team && teamAnswer.approved) {
											score.correctAnswers++;
										}
									}
								}
							}
							scores.push (score);
						}
						result.scores = scores;
						if (round) {
							result.roundNumber = game.activeRound + 1;
							if (round.activeAnswer !== null) {
								result.questionNumber = 1;
								result.maxQuestions = questionsPerRound;
								for (let elem of round.answers) {
									if (elem.closed && elem.question.toString () !== round.answers [round.activeAnswer].question.toString ()) {
										result.questionNumber++;
									}
								}
								let currentQuestion = {};
								currentQuestion.closed = round.answers [round.activeAnswer].closed;
								currentQuestion.teamAnswers = [];
								for (let i = 0; i < round.answers [round.activeAnswer].answers.length; i++) {
									let teamAnswerSource = round.answers [round.activeAnswer].answers [i];
									let teamAnswer = {team: teamAnswerSource.team};
									if (currentQuestion.closed) {
										teamAnswer.answer = teamAnswerSource.answer;
										teamAnswer.approved = teamAnswerSource.approved;
									}
									if (teamAnswerSource.answer !== "") {
										currentQuestion.teamAnswers.push (teamAnswer);
									}
								}
								result.currentQuestion = currentQuestion;
								questions.findOne ({_id: round.answers [round.activeAnswer].question}, (err, result2) => {
									if (err) {
										reject (err.toString ());
									} else if (result2) {
										result.currentQuestion.name = result2.question;
										result.currentQuestion.category = result2.category;
										resolve (result);
									} else {
										reject ("Question not found");
									}
								});
							} else {
								resolve (result);
							}
						} else {
							resolve (result);
						}
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