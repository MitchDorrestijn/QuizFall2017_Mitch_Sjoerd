let games = require ("../schema/games.js").model;

let gameExists = (password, score) => {
	return new Promise ((resolve, reject) => {
		games.findOne ({_id: password}, (err, result) => {
			if (err) {
				reject (err.toString ());
			} else if (result) {
				if (result.closed && !score) {
					reject ("Game is closed and cannot be reopened");
				} else {
					resolve (result);
				}
			} else {
				reject ("Game does not exist");
			}
		})
	});
};

module.exports = gameExists;