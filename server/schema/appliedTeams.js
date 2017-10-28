let mongoose = require ("mongoose");
let Schema = mongoose.Schema;

let appliedTeamSchema = new Schema ({
	_id: {
		type: Schema.Types.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true,
		minlength: 1
	},
	roundPoints: {
		type: Number
	}
});

module.exports = {
	schema: appliedTeamSchema,
	model: mongoose.model ("AppliedTeam", appliedTeamSchema)
};
