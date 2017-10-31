let mongoose = require ("mongoose");
let gameExists = require ("../../../../../functions/gameExists.js");
let teams = require ("../../../../../schema/teams.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app, io) => {
	app.post ("/api/games/:gameId/teams", (req, res) => {
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
					io.of (`/ws/${req.params.gameId}/teams/${team._id}`).on ('connection', (socket) => {
						socket.emit ('connected', {connected: true});
					});
					io.of (`/ws/${req.params.gameId}/master`).emit ('updateApplications', {updateApplications: true});
					io.of (`/ws/${req.params.gameId}/scores`).emit ('updateScore', {updateScore: true});
				}).catch ((err) => {
					res.send ({
						success: false,
						error: err
					});
				});
		}
	});
};

module.exports = api;