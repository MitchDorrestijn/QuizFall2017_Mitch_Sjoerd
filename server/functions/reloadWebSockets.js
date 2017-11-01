/*
 * Reload Socket.IO namespaces for open games
 */

let mongoose = require ("mongoose");
let games = require ("../schema/games.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let reloadWebSockets = (io) => {
	return new Promise ((resolve, reject) => {
		games.find ({closed: false}, (err, result) => {
			if (err) {
				reject (err);
			} else if (result) {
				resolve (result);
			}
		}).then ((games) => {
			let gameIds = [];
			for (let elem of games) {
				io.of (`/ws/${elem._id}/master`).on ('connection', (socket) => {
					socket.emit ('connected', {connected: true});
				});
				io.of (`/ws/${elem._id}/scores`).on ('connection', (socket) => {
					socket.emit ('connected', {connected: true});
				});
				for (let elem2 of elem.teams) {
					io.of (`/ws/${elem._id}/teams/${elem2._id}`).on ('connection', (socket) => {
						socket.emit ('connected', {connected: true});
					});
				}
				gameIds.push (elem._id);
			}
			if (gameIds.length > 0) {
				let plural = "";
				if (gameIds.length > 1) {
					plural += "s";
				}
				console.log (`WebSockets restored for ${gameIds.length} open game${plural}`);
			}
			resolve ();
		}).catch ((err) => {
			console.log (err.toString ());
		});
	});
};

module.exports = reloadWebSockets;
