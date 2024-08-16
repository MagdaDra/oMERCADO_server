const router = require('express').Router();
const User = require('../models/User.model');
const Service = require('../models/Service.model');
const Transaction = require('../models/Transaction.model');

router.post('/checkout', async (req, res, next) => {
	try {
		const { userId, cart, total } = req.body;

		// Create an array of serviceIds in the cart
		let cartIds = cart.map((item) => item.serviceId);

		// Find the serviceIds from the cart in the services array
		const availableServices = await Service.find({
			_id: {
				$in: cartIds,
			},
		});

		let errorArray = [];

		// Check if quantity of items added to cart is bigger than items available - if yes, push the item to the errorArray

		for (let i = 0; i < availableServices.length; i++) {
			if (cart[i].quantity > availableServices[i].quantity) {
				errorArray.push(availableServices[i]);
			}
		}

		if (errorArray.length === 0) {
			const newTransaction = await Transaction.create({
				cart,
				total,
				userId: userId || null,
			});

			// Remove the quantities of each product from the stock
			await Promise.all(
				cart.map(async (item) => {
					const service = await Service.findById(item.serviceId);
					service.quantity -= item.quantity;
					// if qunatity = 0, desactivate the product and remove it from user's services offered
					if (service.quantity === 0){
						service.isActive = false
						await User.findByIdAndUpdate(service.createdBy, {
							$pull: { servicesOffered: item.serviceId }
						});						

					}
					await service.save();
					
				}),
			);

			// Update buyer's servicesBought array
			await User.findByIdAndUpdate(userId, {
				$push: {
					servicesBought: newTransaction._id,
				},
			});

			//Add to the seller's servicesSold array

			await Promise.all(
				cart.map(async (item) => {
					const service = await Service.findById(item.serviceId);
					const ownerId = service.createdBy;

					await User.findByIdAndUpdate(ownerId, {
						$push: {
							servicesSold: item.serviceId,
						},
					});
				}),
			);
			res.status(200).json(newTransaction);

			
		} else {
			res.status(401).json({
				message: `Ooops, we have limited quantity of the services below: ${errorArray
					.map(
						(service) =>
							`${service.serviceName}, available: ${service.quantity} \n`,
					)
					.join(', ')} `,
			});
		}
	} catch (error) {
		console.error(error);
	}
});

router.post('/cartInfo', async (req, res, next) => {
	try {
		const {cart} = req.body
		let cartIds = cart.map((item) => item._id);
		console.log('Cart: ',cart)
		const cartServices = await Service.find({
			_id: {
				$in: cartIds,
			},
		});
		res.status(200).json(cartServices)

	} catch (error) {
		console.error(error)
	}
}) 

module.exports = router;
