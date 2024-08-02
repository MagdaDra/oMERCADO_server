const { Schema, model } = require('mongoose');

const serviceSchema = new Schema({
	serviceName: { type: String, required: true },
	serviceDescription: { type: String, required: true },
	price: Number,
	quantity: {
		type: Number,
		required: true,
		min: 1,
		max: 100,
		default: 1,
	},
	date: { type: String },
	img: { type: String },
	category: {
		type: [String],
		enum: [
			'Web',
			'Art',
			'Design',
			'Sport',
			'Outdoor',
			'Group',
			'Food',
			'Fashion',
			'Sightseeing',
		],
	},
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

const Service = model('Service', serviceSchema);

module.exports = Service;
