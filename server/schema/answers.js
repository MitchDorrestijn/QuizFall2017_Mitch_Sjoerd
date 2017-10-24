let mongoose = require ("mongoose");
let questionModel = require ("./questions.js").model;
let Schema = mongoose.Schema;

let teamAnswerSchema = new Schema ({
	team: {
		type: Schema.Types.ObjectId,
		ref: 'Team',
		required: true
	},
	answer: {
		type: String,
		required: true,
		default: ""
	},
	approved: {
		type: Boolean,
		required: true,
		default: false
	}
});

let answerSchema = new Schema ({
	_id: Schema.Types.ObjectId,
	question: {
		type: Schema.Types.ObjectId,
		ref: 'Question',
		required: true
	},
	closed: {
		type: Boolean,
		required: true
	},
	answers: [teamAnswerSchema]
});

module.exports = {
	schema: answerSchema,
	model: mongoose.model ("Answer", answerSchema)
};
