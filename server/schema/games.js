let mongoose = require ("mongoose");
let answerModel = require ("./answers.js").model;
let questionModel = require ("./questions.js").model;
let appliedTeamSchema = require ("./appliedTeams.js").schema;
let roundSchema = require ("./rounds.js").schema;
let Schema = mongoose.Schema;

let gameSchema = new Schema ({
	_id: {
		type: String,
		minlength: 1,
		required: true
	},
	closed: {
		type: Boolean,
		required: true,
		default: false
	},
	playedQuestions: [{
		type: Schema.Types.ObjectId,
		ref: 'Question'
	}],
	teams: {
		type: [appliedTeamSchema],
		default: []
	},
	rounds:{
		type: [roundSchema],
		default: []
	},
	activeRound: {
		type: Number,
		default: null
	}
}, {collection: 'Games'});

module.exports = {
	schema: gameSchema,
	model: mongoose.model ("Game", gameSchema)
};
