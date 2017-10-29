let mongoose = require ("mongoose");
let mongooseRandom = require ("mongoose-simple-random");
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

questionSchema.plugin (mongooseRandom);

module.exports = {
	schema: questionSchema,
	model: mongoose.model ("Question", questionSchema)
};
