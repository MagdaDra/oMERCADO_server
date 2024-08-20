const { Schema, model } = require('mongoose');

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: [true, 'Email is required.'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required.'],
			minLength: 8,
		},
		typeOfUser: [
			{ type: String, required: true, enum: ['Customer', 'Seller'] },
		],
		name: String,
		img: String,
		servicesBought: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
		servicesOffered: [{ type: Schema.Types.ObjectId, ref: 'Service' }]	,
		servicesSold: [
			{
				serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
				quantity: Number
			}
		],
		comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	},
);

const User = model('User', userSchema);

module.exports = User;
