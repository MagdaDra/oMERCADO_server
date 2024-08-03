const router = require('express').Router();
const Transaction = require('../models/Transaction.model');

router.post('/transaction', async (req, res, next) => {
	try {
		const { cart } = req.body;

		const newTransaction = await Transaction.create({
			cart,
		});

		res.status(201).json(newTransaction);
	} catch (error) {
		console.error(error);
	}
});

module.exports = router;
