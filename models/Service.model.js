const { Schema, model } = require('mongoose');

const serviceSchema = new Schema({
	serviceName: { type: String, required: true },
	serviceDescription: { type: String, required: true },
	quantity: {
		type: number,
		required: true,
		min: 1,
		max: 100,
		default: 1,
	},
	date: { type: Date },
	img: { type: String },
	category: { type: String },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

const Service = model('Service', serviceSchema);

module.exports = Service;
