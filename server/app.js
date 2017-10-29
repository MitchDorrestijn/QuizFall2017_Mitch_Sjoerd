let randomstring = require ("randomstring");
let express = require ("express");
let bodyParser = require ("body-parser");
let mongoose = require ("mongoose");
let gameExists = require ("./functions/gameExists.js");
let questions = require ("./schema/questions.js").model;
let games = require ("./schema/games.js").model;
let teams = require ("./schema/teams.js").model;
let cors = require ("cors");

let port = 8080;

let app = express ();

mongoose.connect ("mongodb://localhost/quizzr", {useMongoClient: true}, (err) => {
	if (err) {
		console.log ("Error: "+err);
	} else {
		console.log ("Connected to MongoDB");
	}
});

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

// Allow AJAX requests from any host
app.use (cors ({
	origin: '*'
}));

app.use (bodyParser.json ());

// QuizzMaster
app.post ("/api/games", (req, res) => {
	// TODO unit test
	let password;
	let firstRound = true;
	loop = () => {
		password = randomstring.generate (7);
		let promise = new Promise ((resolve, reject) => {
			games.findOne ({_id: password}, (err, result) => {
				if (err) {
					reject (err.toString ());
				} else {
					if (!result) {
						resolve ();
					} else {
						reject (null);
					}
				}
			})
		}).then (() => {
			return new Promise ((resolve, reject) => {
				let game = new games ({_id: password});
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
				error: null,
				password: password
			});
		}).catch ((err) => {
			if (err) {
				res.send ({
					success: false,
					error: err
				});
			} else {
				loop ();
			}
		});
	};
	if (firstRound) {
		firstRound = false;
		loop ();
	}
});

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
						game.closed = true;
						game.save ((err) => {
							if (err) {
								reject (err.toString ());
							} else {
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

app.get ("/api/categories", (req, res) => {
	questions.find ().distinct ('category', (err, categories) => {
		let response = [];
		for (let elem of categories) {
			response.push ({name: elem});
		}
		res.json (response);
	});
});

app.get ("/api/games/:gameId/teams", (req, res) => {
	// TODO unit test
	// TODO test accepted teams
	if (!req.params.gameId) {
		res.json ({
			success: false,
			error: "No gameID specified"
		});
	} else {
		let promise = new Promise ((resolve, reject) => {
			let entries = [];
			teams.find ({appliedGame: req.params.gameId}, (err, result) => {
				if (err) {
					reject (err.toString ());
				} else {
					if (result) {
						for (let i = 0; i < result.length; i++) {
							let entry = result [i].toObject ();
							delete entry.appliedGame;
							delete entry.__v;
							entry.approved = false;
							entries.push (entry);
						}
					}
					resolve (entries);
				}
			});
		}).then ((entries) => {
			return new Promise ((resolve, reject) => {
				let gameExistsP = gameExists (req.params.gameId)
					.then ((game) => {
						for (let elem of game.teams) {
							let entry = elem.toObject ();
							delete entry.__v;
							delete entry.roundPoints;
							entry.approved = true;
							entries.push (entry);
						}
						resolve (entries);
					}).catch ((err) => {
						reject (err);
					});
			});
		}).then ((entries) => {
			return new Promise ((resolve, reject) => {
				if (entries.length > 0) {
					res.json (entries);
					resolve ();
				} else {
					reject ("No teams have applied yet");
				}
			});
		}).catch ((err) => {
			res.json ({
				success: false,
				error: err
			});
		});
	}
});

app.put ("/api/games/:gameId/teams/:teamId", (req, res) => {
	if (!req.params.gameId) {
		res.json ({
			success: false,
			error: "No game ID specified"
		});
	} else if (!req.params.teamId) {
		res.json ({
			success: false,
			error: "No team ID specified"
		});
	} else if (!req.body.hasOwnProperty ('approved')) {
		res.json ({
			success: false,
			error: "No approved flag specified"
		});
	} else if (req.body.approved) {
		// Approving a team works!
		let promise = gameExists (req.params.gameId)
			.then ((game) => {
				return new Promise ((resolve, reject) => {
					// Check whether the team ID has applied to the game
					teams.findOne ({_id: req.params.teamId, appliedGame: req.params.gameId}, (err, result) => {
						if (err) {
							reject (err.toString);
						} else if (!result) {
							reject ("Team not found, or has already been accepted");
						} else {
							resolve ([game, result]);
						}
					});
				});
			}).then ((gameAndTeam) => {
				return new Promise ((resolve, reject) => {
					let team = gameAndTeam [1];
					teams.deleteOne ({_id: team._id}, (err) => {
						if (err) {
							reject (err.toString ());
						} else {
							resolve (gameAndTeam);
						}
					});
				});
			}).then ((gameAndTeam) => {
				return new Promise ((resolve, reject) => {
					let game = gameAndTeam [0];
					let team = gameAndTeam [1].toObject ();
					delete team.appliedGame;
					team.roundPoints = 0;
					game.teams.push (team);
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
	} else if (!req.body.approved) {
		let promise = gameExists (req.params.gameId)
			.then ((game) => {
				return new Promise ((resolve, reject) => {
					let success = false;
					let removedTeam;
					for (let i = 0; i < game.teams.length; i++) {
						if (game.teams [i]._id.toString () === req.params.teamId) {
							removedTeam = game.teams [i].toObject ();
							game.teams.splice (i, 1);
							success = true;
							i--;
						}
					}
					if (success) {
						resolve ([game, removedTeam]);
					} else {
						reject ("Team not found in game");
					}
				});
			}).then ((gameAndTeam) => {
				return new Promise ((resolve, reject) => {
					let game = gameAndTeam [0];
					let removedTeam = gameAndTeam [1];
					delete removedTeam.roundPoints;
					delete removedTeam.__v;
					removedTeam.appliedGame = game._id;
					let team = new teams (removedTeam);
					team.save ((err) => {
						if (err) {
							reject (err.toString ());
						} else {
							resolve (game);
						}
					});
				});
			}).then ((game) => {
				return new Promise ((resolve, reject) => {
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
					let round = {
						answers: [],
						activeAnswer: null
					};
					game.rounds.push (round);
					let roundNumber = game.rounds.length - 1;
					game.activeRound = roundNumber;
					game.save ((err) => {
						if (err) {
							reject (err);
						} else {
							resolve (roundNumber);
						}
					});
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

app.post ("/api/games/:gameId/rounds/:roundId/questions", (req, res) => {
	if (!req.params.gameId) {
		res.json ({
			success: false,
			error: "No game ID specified"
		});
	} else if (!req.params.roundId) {
		res.json ({
			success: false,
			error: "No round ID specified"
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
					if (game.activeRound !== parseInt (req.params.roundId, 10)) {
						reject ("You can only add questions to the active round");
					} else {
						resolve (game);
					}
				});
			}).then ((game) => {
				return new Promise ((resolve, reject) => {
					questions.findRandom (
						{_id: { $nin: game.playedQuestions }, category: { $in: req.body.categories }},
						{},
						{limit: 12},
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
						game.rounds [parseInt (req.params.roundId, 10)].answers.push ({
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

// QuizApp
app.post ("/api/games/:gameId/teams", (req, res) => {
	// TODO unit test
	if (!req.params.gameId) {
		res.json ({
			success: false,
			error: "No gameID specified"
		});
	} else if (!req.body.name || req.body.name === "") {
		res.json ({
			success: false,
			error: "No name specified"
		});
	} else {
		let team = new teams ({
			name: req.body.name,
			appliedGame: req.params.gameId
		});
		let promise = gameExists (req.params.gameId)
			.then ((game) => {
				return new Promise ((resolve, reject) => {
					let success = true;
					for (let elem of game.teams) {
						if (req.body.name === elem.name) {
							success = false;
						}
					}
					if (success) {
						resolve ();
					} else {
						reject ("Team has already been accepted into the game");
					}
				})
			}).then (() => {
				return new Promise ((resolve, reject) => {
					teams.findOne ({appliedGame: req.params.gameId, name: req.body.name}, (err, result) => {
						// Check whether the team has already applied to the game
						if (err) {
							reject (err.toString ());
						} else if (result) {
							reject ("Team has already applied for this game");
						} else {
							resolve ();
						}
					});
				});
			}).then (() => {
				return new Promise ((resolve, reject) => {
					team.save ((err) => {
						if (err) {
							reject (err.toString ());
						} else {
							resolve ();
						}
					});
				});
			}).then (() => {
				res.send ({
					success: true,
					error: null,
					teamId: team._id
				});
			}).catch ((err) => {
				res.send ({
					success: false,
					error: err
				});
			});
	}
});

app.get ("/api/games/:gameId/teams/:teamId", (req, res) => {
	if (!req.params.gameId) {
		res.json ({
			success: false,
			error: "No game ID specified"
		});
	} else if (!req.params.teamId) {
		res.json ({
			success: false,
			error: "No team ID specified"
		});
	} else {
		let promise = gameExists (req.params.gameId)
			.then ((game) => {
				return new Promise ((resolve, reject) => {
					let approved = false;
					for (elem of game.teams) {
						if (elem._id.toString () === req.params.teamId) {
							approved = true;
						}
					}
					resolve (approved);
				});
			}).then ((value) => {
				res.json ({
					approved: value
				});
			}).catch ((err) => {
				res.json ({
					success: false,
					error: err
				});
			});
	}
});

app.get ("/api/games/:gameId/rounds/current", (req, res) => {
	if (!req.params.gameId) {
		res.json ({
			success: false,
			error: "No game ID specified"
		});
	} else {
		let promise = gameExists (req.params.gameId)
			.then ((game) => {
				return new Promise ((resolve) => {
					resolve (game.activeRound);
				});
			}).then ((activeRound) => {
				res.json ({
					activeRound: activeRound
				});
			}).catch ((err) => {
				res.json ({
					success: false,
					error: err
				});
			});
	}
});

// Start the server
app.listen (port, () => console.log (`Server listening on port ${port}`));
