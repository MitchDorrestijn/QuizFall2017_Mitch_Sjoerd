let assert = require ("assert");
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let Team = require ("./schema/teams.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

describe ('Schema', () => {
	describe ('Team', () => {
		it ("Empty names shouldn't be allowed", (done) => {
			let team = new Team ({
				appliedGame: mongoose.Types.ObjectId ("59ef07d7aadfa2616a17bbd3"),
				name: null
			});
			team.validate ((err) => {
				assert.ok (err.errors.name);
				done ();
			});
		});
		it ("Empty applied game shouldn't be allowed", (done) => {
			let team = new Team ({
				appliedGame: null,
				name: "Teamnaam"
			});
			team.validate ((err) => {
				assert.ok (err.errors.appliedGame);
				done ();
			});
		});
		it ("Valid case", (done) => {
			let team = new Team ({
				appliedGame: mongoose.Types.ObjectId ("59ef07d7aadfa2616a17bbd3"),
				name: "Teamnaam"
			});
			team.validate ((err) => {
				assert.ok (!err);
				done ();
			});
		});
	});
});
