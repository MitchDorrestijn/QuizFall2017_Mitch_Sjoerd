let mongoose = require ("mongoose");
let gameExists = require ("../../../../../../../../functions/gameExists.js");

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app, io) => {
	app.put ("/api/games/:gameId/rounds/current/answers/current", (req, res) => {
		if (!req.params.gameId) {
			res.json ({
				success: false,
				error: "No game ID specified"
			});
		} else {
			if (req.body.team && req.body.hasOwnProperty ("correct")) {
				let promise = gameExists (req.params.gameId)
					.then ((game) => {
						return new Promise ((resolve, reject) => {
							let roundId = game.activeRound;
							if (roundId !== null) {
								let activeAnswer = game.rounds [roundId].activeAnswer;
								if (activeAnswer !== null) {
									if (game.rounds [roundId].answers [activeAnswer].closed) {
										let success = false;
										for (let i = 0; i < game.rounds [roundId].answers [activeAnswer].answers.length; i++) {
											if (game.rounds [roundId].answers [activeAnswer].answers [i].team === req.body.team) {
												game.rounds [roundId].answers [activeAnswer].answers [i].approved = req.body.correct;
												success = true;
											}
										}
										if (success) {
											resolve (game);
										} else {
											reject ("Team not found");
										}
									} else {
										reject ("Question is not closed");
									}
								} else {
									reject ("No question is active");
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
			} else if (req.body.team && req.body.answer) {
				let promise = gameExists (req.params.gameId)
					.then ((game) => {
						return new Promise ((resolve, reject) => {
							let roundId = game.activeRound;
							if (roundId !== null) {
								let activeAnswer = game.rounds [roundId].activeAnswer;
								if (activeAnswer !== null) {
									if (!game.rounds [roundId].answers [activeAnswer].closed) {
										let success = false;
										for (let i = 0; i < game.rounds [roundId].answers [activeAnswer].answers.length; i++) {
											if (game.rounds [roundId].answers [activeAnswer].answers [i].team === req.body.team) {
												game.rounds [roundId].answers [activeAnswer].answers [i].answer = req.body.answer;
												success = true;
											}
										}
										if (success) {
											resolve (game);
										} else {
											reject ("Team not found");
										}
									} else {
										reject ("Question is closed");
									}
								} else {
									reject ("No question is active");
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
									io.of (`/ws/${req.params.gameId}/master`).emit ('updateAnswers', {updateAnswers: true});
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
			} else {
				res.json ({
					success: false,
					error: "No flag or answer specified"
				});
			}
		}
	});
};

module.exports = api;