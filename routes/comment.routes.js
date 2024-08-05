const router = require('express').Router();
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');
const Transaction = require('../models/Transaction.model');
const Service = require('../models/Service.model')


// Create a comment only if the user has already bought the product

router.post('/comment', async (req, res, next) => {
	try {
		const { serviceId, userId, rating, comment } = req.body;

		// Find all transactions of the user
		const userTransactions = await Transaction.find(userId);

		
		// Find the userId of the person who created the service(so that sellers cannot comment their own services)
		const sellerId = await Service.findById(serviceId).populate('createdBy')

		console.log('Seller ID is: ', sellerId) // ??? why is it showing the whole service ?
        

        //console.log(userTransactions.find(item => item.cart.filter(service => service.serviceId.toString() === serviceId).length))

		// Check if the user has already bought the service and if they're not the creator of the service
		if (userTransactions.find(item => item.cart.filter(service => service.serviceId.toString() === serviceId).length) && sellerId.toString() !== userId ) {
            
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

// Edit the comment posted by the user 






module.exports = router;
