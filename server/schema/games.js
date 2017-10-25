let mongoose = require ("mongoose");
let answerModel = require ("./answers.js").model;
let questionModel = require ("./questions.js").model;
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
	teams: [{
		type: Schema.Types.ObjectId,
		ref: 'Team'
	}],
	rounds: [{
		type: Schema.Types.ObjectId,
		ref: 'Round'
	}],
	activeRound: {
		type: Schema.Types.ObjectId,
		ref: 'Round'
	}
}, {collection: 'Games'});

module.exports = {
	schema: gameSchema,
	model: mongoose.model ("Game", gameSchema)
};
