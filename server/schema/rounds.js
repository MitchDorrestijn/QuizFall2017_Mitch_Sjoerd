let mongoose = require ("mongoose");
let answerModel = require ("./answers.js").model;
let Schema = mongoose.Schema;

let roundSchema = new Schema ({
	_id: Schema.Types.ObjectId,
	answers: [{
		type: Schema.Types.ObjectId,
		ref: 'Answer'
	}],
	activeAnswer: {
		type: Schema.Types.ObjectId,
		ref: 'Answer',
		default: null
	}
}, {collection: 'Rounds'});

module.exports = {
	schema: roundSchema,
	model: mongoose.model ("Round", roundSchema)
};
