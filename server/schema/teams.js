let mongoose = require ("mongoose");
let Schema = mongoose.Schema;

let teamSchema = new Schema ({
	_id: Schema.Types.ObjectId,
	appliedGame: {
		type: String,
		ref: 'Game',
		required: true
	},
	name: {
		type: String,
		required: true
	}
});

module.exports = {
	schema: teamSchema,
	model: mongoose.model ("Team", teamSchema)
};
