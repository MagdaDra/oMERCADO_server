const router = require('express').Router();
const User = require('../models/User.model');


// Add to cart (push to the cart array in User)
// Check if the item exists in the cart -> if yes update the quantity

router.post('/cart', async (req, res, next) => {
	try {
		const { userId, cart } = req.body;
		const { serviceId, quantity, price } = cart;

		let addToCart;

		// Find the user
		const user = await User.findById(userId);


		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Check if the item already exists in the cart

		const itemIndex = user.cart.findIndex(
			(item) =>
				item.serviceId && item.serviceId.toString() === serviceId.toString(),
		);


			// Method itemIndex returns -1 if the element is not found
		if (itemIndex > -1) {
			// Item exists in the cart, update the quantity
			user.cart[itemIndex].quantity += quantity;
			user.cart[itemIndex].price = price * quantity; // ??????? price here should be a unit price of the service
			addToCart = await user.save();
		} else {
			// Item doesn't exist in the cart, push the new item
			user.cart.push({ serviceId, quantity, price });
			addToCart = await user.save();
		}

		res.status(201).json(addToCart);
	} catch (error) {
		console.error(error)
	}
})




// edit number of items in the cart
// check if the item exists in the cart -> if yes update the quantity

router.put('/cart', async (req, res, next) => {
	try {
		const { userId, cart } = req.body;
		const { serviceId, quantity, price } = cart;

		let editCartQuantity;

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
			user.cart[itemIndex].price = price * quantity;
			editCartQuantity = await user.save();
		} else {
			// Item doesn't exist in the cart, push the new item
			user.cart.push({ serviceId, quantity, price });
			editCartQuantity = await user.save();
		}

		res.status(201).json(editCartQuantity);
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
