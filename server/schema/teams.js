let mongoose = require ("mongoose");
let Schema = mongoose.Schema;

let teamSchema = new Schema ({
	_id: Schema.Types.ObjectId,
	appliedGame: {
		type: String,
		minlength: 1,
		ref: 'Game',
		required: true
	},
	name: {
		type: String,
		minlength: 1,
		required: true
	}
}, {collection: 'Teams'});

module.exports = {
	schema: teamSchema,
	model: mongoose.model ("Team", teamSchema)
};
