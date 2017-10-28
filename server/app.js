let randomstring = require ("randomstring");
let express = require ("express");
let bodyParser = require ("body-parser");
let mongoose = require ("mongoose");
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
					reject (err);
				} else {
					if (!result) {
						resolve ();
					} else {
						reject (null);
					}
				}
			})
		}).then (() => {
			let promise2 = new Promise ((resolve, reject) => {
				let game = new games ({_id: password});
				game.save ((err) => {
					if (err) {
						reject (err);
					} else {
						resolve ();
					}
				});
			});
			return promise2;
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

app.get ("/api/categories", (req, res) => {
	questions.find ().distinct ('category', (err, categories) => {
		res.json (categories);
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
			let promise2 = new Promise ((resolve, reject) => {
				games.findOne ({_id: req.params.gameId}, (err, result) => {
					if (err) {
						reject (err.toString ());
					} else if (!result) {
						reject ("Game not found");
					} else {
						for (let elem of result.teams) {
							let entry = elem.toObject ();
							entry.approved = true;
							entries.push (entry);
						}
						resolve (entries);
					}
				});
			});
			return promise2;
		}).then ((entries) => {
			let promise3 = new Promise ((resolve, reject) => {
				if (entries.length > 0) {
					res.json (entries);
					resolve ();
				} else {
					reject ("No teams have applied yet");
				}
			});
			return promise3;
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
		let promise = new Promise ((resolve, reject) => {
			// Check whether the game exists
			games.findOne ({_id: req.params.gameId}, (err, result) => {
				if (err) {
					reject (err.toString);
				} else if (!result) {
					reject ("Game not found");
				} else {
					resolve (result);
				}
			});
		}).then ((game) => {
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
		let promise = new Promise ((resolve, reject) => {
			games.findOne ({_id: req.params.gameId}, (err, result) => {
				if (err) {
					reject (err.toString);
				} else if (!result) {
					reject ("Game not found");
				} else {
					resolve (result);
				}
			});
		}).then ((game) => {
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
		let promise = new Promise ((resolve, reject) => {
			games.findOne ({_id: req.params.gameId}, (err, result) => {
				// Check whether the team has already been accepted into the game
				if (err) {
					reject (err.toString ());
				} else if (result) {
					let success = true;
					for (let elem of result.teams) {
						if (req.body.name === elem.name) {
							success = false;
						}
					}
					if (success) {
						resolve ();
					} else {
						reject ("Team has already been accepted into the game");
					}
				} else {
					reject ("Game not found");
				}
			})
		}).then (() => {
			let promise2 = new Promise ((resolve, reject) => {
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
			return promise2;
		}).then (() => {
			let promise4 = new Promise ((resolve, reject) => {
				team.save ((err) => {
					if (err) {
						reject (err.toString ());
					} else {
						resolve ();
					}
				});
			});
			return promise3;
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

// Start the server
app.listen (port, () => console.log (`Server listening on port ${port}`));
