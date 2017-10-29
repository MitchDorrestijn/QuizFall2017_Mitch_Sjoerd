let mongoose = require ("mongoose");
let Schema = mongoose.Schema;

let teamAnswerSchema = new Schema ({
	team: {
		type: String,
		required: true
	},
	answer: {
		type: String,
		default: ""
	},
	approved: {
		type: Boolean,
		default: false
	}
}, {_id: false});

module.exports = {
	schema: teamAnswerSchema,
	model: mongoose.model ("TeamAnswer", teamAnswerSchema)
};
