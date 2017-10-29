let mongoose = require ("mongoose");
let answerSchema = require ("./answers.js").schema;
let Schema = mongoose.Schema;

let roundSchema = new Schema ({
	answers: {
		type: [answerSchema],
		default: null
	},
	activeAnswer: {
		type: Number,
		default: null
	}
}, {_id: false});

module.exports = {
	schema: roundSchema,
	model: mongoose.model ("Round", roundSchema)
};
