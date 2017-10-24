let mongoose = require ("mongoose");
let Schema = mongoose.Schema;

let questionSchema = new Schema ({
	_id: Schema.Types.ObjectId,
	question: {
		type: String,
		required: true
	},
	answer: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	}
});

module.exports = {
	schema: questionSchema,
	model: mongoose.model ("Question", questionSchema)
};
