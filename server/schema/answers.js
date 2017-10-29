let mongoose = require ("mongoose");
let questionModel = require ("./questions.js").model;
let teamAnswerSchema = require ("./teamAnswers.js").schema;
let Schema = mongoose.Schema;

let answerSchema = new Schema ({
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
}, {_id: false});

module.exports = {
	schema: answerSchema,
	model: mongoose.model ("Answer", answerSchema)
};
