let randomstring = require ("randomstring");
let express = require ("express");
let mongoose = require ("mongoose");
let questions = require ("./schema/questions.js").model;
let games = require ("./schema/games.js").model;
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

// QuizzMaster
app.post ("/api/games", (req, res) => {
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
			res.json ({password: password});
		}).catch ((err) => {
			console.log (err);
			if (err) {
				res.send (err);
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

// Start the server
app.listen (port, () => console.log (`Server listening on port ${port}`));
