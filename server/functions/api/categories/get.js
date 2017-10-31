let mongoose = require ("mongoose");
let questions = require ("../../../schema/questions.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

let api = (app) => {
	app.get ("/api/categories", (req, res) => {
		questions.find ().distinct ('category', (err, categories) => {
			let response = [];
			for (let elem of categories) {
				response.push ({name: elem});
			}
			res.json (response);
		});
	});
};

module.exports = api;