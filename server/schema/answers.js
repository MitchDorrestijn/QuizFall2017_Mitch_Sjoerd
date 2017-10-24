let mongoose = require ("mongoose");
let questionModel = require ("./questions.js").model;
let teamAnswerSchema = require ("./teamAnswers.js").schema;
let Schema = mongoose.Schema;

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
