const router = require('express').Router();
const User = require('../models/User.model');

// add to cart (push to the cart array in User)
// check if the item exists in the cart -> if yes update the quantity

router.put('/cart', async (req, res, next) => {
	try {
		const { userId, cart } = req.body;
		const { serviceId, quantity } = cart;

		let addToCart;

		// Find the user
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Check if the item already exists in the cart

		console.log('Service ID from request: ', serviceId);
		console.log('User cart before update:', JSON.stringify(user.cart, null, 2));

		const itemIndex = user.cart.findIndex(
			(item) =>
				item.serviceId && item.serviceId.toString() === serviceId.toString(),
		);

		//method itemIndex returns -1 if the element is not found

		if (itemIndex > -1) {
			// Item exists in the cart, update the quantity
			user.cart[itemIndex].quantity = quantity;
			addToCart = await user.save();
		} else {
			// Item doesn't exist in the cart, push the new item
			user.cart.push({ serviceId, quantity });
			addToCart = await user.save();
		}

		res.status(201).json(addToCart);
	} catch (error) {
		console.error(error);
	}
});

// Delete an item from the cart

router.delete('/cart', async (req, res, next) => {
	try {
		const { userId, cart } = req.body;
		const { serviceId } = cart;

		// Find the user
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const itemIndex = user.cart.findIndex(
			(item) =>
				item.serviceId && item.serviceId.toString() === serviceId.toString(),
		);

		if (itemIndex > -1) {
			user.cart.splice(itemIndex, 1);
			const cartAfterDelete = await user.save();
			res.status(201).json(cartAfterDelete);
		} else {
			return res.status(404).json({ message: 'Item not found in cart' });
		}
	} catch (error) {
		console.error(error);
	}
});

module.exports = router;
