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
}, {collection: 'Rounds'});

module.exports = {
	schema: roundSchema,
	model: mongoose.model ("Round", roundSchema)
};
