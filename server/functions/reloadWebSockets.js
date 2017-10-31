/*
 * Reload Socket.IO namespaces for open games
 */

mongoose = require ("mongoose");
games = require ("../schema/games.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

reloadWebSockets = (io) => {
	return new Promise ((resolve, reject) => {
		games.find ({closed: false}, (err, result) => {
			if (err) {
				reject (err);
			} else if (result) {
				resolve (result);
			}
		}).then ((games) => {
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
			}
			resolve ();
		}).catch ((err) => {
			console.log (err.toString ());
		});
	});
};

module.exports = reloadWebSockets;
