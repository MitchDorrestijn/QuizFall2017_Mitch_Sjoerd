let mongoose = require ("mongoose");
let gameExists = require ("../../../../../../functions/gameExists.js");
let teams = require ("../../../../../../schema/teams.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app, io) => {
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
					io.of (`/ws/${req.params.gameId}/teams/${req.params.teamId}`).emit ('joinGame', {joinGame: true});
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
					io.of (`/ws/${req.params.gameId}/teams/${req.params.teamId}`).emit ('joinGame', {joinGame: false});
					io.of (`/ws/${req.params.gameId}/scores`).emit ('updateScore', {updateScore: true});
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