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

// Start the server
app.listen (port, () => console.log (`Server listening on port ${port}`));
