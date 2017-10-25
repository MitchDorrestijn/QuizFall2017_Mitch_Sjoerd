let mongoose = require ("mongoose");
let Schema = mongoose.Schema;

let questionSchema = new Schema ({
	_id: Schema.Types.ObjectId,
	question: {
		type: String,
		minlength: 1,
		required: true
	},
	answer: {
		type: String,
		minlength: 1,
		required: true
	},
	category: {
		type: String,
		minlength: 1,
		required: true
	}
}, {collection: 'Questions'});

module.exports = {
	schema: questionSchema,
	model: mongoose.model ("Question", questionSchema)
};
