const { Schema, model } = require('mongoose');

const serviceSchema = new Schema({
	serviceName: { type: String, required: true },
	serviceDescription: { type: String, required: true },
	price: Number,
	quantity: {
		type: Number,
		required: true,
		min: 0,
		max: 100,
		default: 1,
	},
	date: String,
	img: String,
	category: {
		type: [String],
		enum: [
			'IT',
			'Art',
			'Design',
			'Sport',
			'Food',
			'Sightseeing',
		],
	},
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	isActive: { type: Boolean, default: true }

});

const Service = model('Service', serviceSchema);

module.exports = Service;
