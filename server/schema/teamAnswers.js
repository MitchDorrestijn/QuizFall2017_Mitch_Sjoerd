let mongoose = require ("mongoose");
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

module.exports = {
	schema: teamAnswerSchema,
	model: mongoose.model ("TeamAnswer", teamAnswerSchema)
};
