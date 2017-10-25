let mongoose = require ("mongoose");
let Schema = mongoose.Schema;

let appliedTeamSchema = new Schema ({
	name: {
		type: String,
		required: true,
		minlength: 1
	}
});

module.exports = {
	schema: appliedTeamSchema,
	model: mongoose.model ("AppliedTeam", appliedTeamSchema)
};
