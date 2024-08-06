const router = require('express').Router();
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');
const Transaction = require('../models/Transaction.model');
const Service = require('../models/Service.model');

// Create a comment only if the user has already bought the product

router.post('/comments', async (req, res, next) => {
	try {
		const { serviceId, userId, rating, comment } = req.body;

		// Find all transactions of the user
		const userTransactions = await Transaction.find({ userId }); // find needs to receive an object

		// Find the userId of the person who created the service(so that sellers cannot comment their own services)
		const serviceFromDB = await Service.findById(serviceId);

		// Check if the user has already bought the service and if they're not the creator of the service
		if (
			userTransactions.find(
				(item) =>
					item.cart.filter(
						(service) => service.serviceId.toString() === serviceId,
					).length,
			) &&
			serviceFromDB.createdBy.toString() !== userId
		) {
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
				message: `The user hasn't bought this item`,
			});
		}
	} catch (error) {
		console.error(error);
	}
});

// Get all the comments that the user posted

router.get('/comments', async (req, res, next) => {
	try {
		const { userId } = req.body;
		const userFromDB = await User.findById(userId);

		const allComments = userFromDB.comments;

		res.status(200).json(allComments);
	} catch (error) {
		console.error(error);
	}
});

// Edit only the comments posted by the user

router.put('/comments/:commentId', async (req, res, next) => {
	try {
		const { commentId } = req.params;
		const { userId, rating, comment } = req.body;

		const commentDetailsFromDB = await Comment.findById(commentId);

		if (commentDetailsFromDB.userId.toString() === userId) {
			const updatedComment = await Comment.findByIdAndUpdate(
				commentId,
				{
					rating,
					comment,
				},
				{
					new: true,
				},
			);
			res.status(200).json(updatedComment);
		} else {
			res.status(401).json({
				message: `The user didn't post this comment`,
			});
		}
	} catch (error) {
		console.error(error);
	}
});

// Delete only the comments posted by the user

router.delete('/comments/:commentId', async (req, res, next) => {
	try {
		const { commentId } = req.params;
		const { userId } = req.body;

		const commentDetailsFromDB = await Comment.findById(commentId);

		if (commentDetailsFromDB.userId.toString() === userId) {
			await Comment.findOneAndDelete(commentId);

			res.status(204).send();
		} else {
			res.status(401).json({
				message: `The user can't delete this comment as it wasn't posted by them`,
			});
		}
	} catch (error) {
		console.error(error);
	}
});

module.exports = router;
