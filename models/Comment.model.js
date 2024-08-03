const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
	{
		serviceId: {type: Schema.Types.ObjectId, ref: 'Service'},
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		rating: { type: Number, required: true },
		comment: { type: String, required: true },
	},
	{
		timestamps: true,
	},
);

const Comment = model('Comment', commentSchema);

module.exports = Comment;
