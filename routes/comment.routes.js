const router = require('express').Router();
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');
const Transaction = require('../models/Transaction.model');

router.post('/comment', async (req, res, next) => {
	try {
		const { serviceId, userId, rating, comment } = req.body;

		// Find all transactions of the user
		const userTransactions = await Transaction.find(userId);

        

        console.log(userTransactions.find(item => item.cart.filter(service => service.serviceId.toString() === serviceId).length))

		// Check if the user has already bought the service
		if (userTransactions.find(item => item.cart.filter(service => service.serviceId.toString() === serviceId).length)) {
            
			const newComment = await Comment.create({
				serviceId,
				userId,
				rating,
				comment,
			});

			const userComments = await User.findByIdAndUpdate(userId, {
				$push: {
					comments: newComment._id,
				},
			});

			res.status(201).json(newComment);
		} else {
            res.status(401).json({
                message: `The user hasn't bought this item`
            })
        }
	} catch (error) {
		console.error(error);
	}
});

module.exports = router;
