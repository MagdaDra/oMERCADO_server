const router = require('express').Router();
const User = require('../models/User.model');
const Service = require('../models/Service.model');

router.put('/checkout', async (req, res, next) => {
    try {
        const {userId, cart} = req.body

        // Find the user
		const user = await User.findById(userId);

        // Check if the quantity of the service in the cart array is less than the array of the service available

        const cartArray = user.cart;

        let payment = false

        cartArray.map((cartItem) => {
            const service = await Service.findById(cartItem.serviceId)

            if (service.quantity >= cartItem.quantity) {
                payment = true
            } else {
                payment = false
            }
        })



    } catch (error) {
        console.error(error)
    }
})

//check if the quantity of the service in the cart array is less thant the array of the service available

// sum the prices of the items

// remove the items from the stock

// add to servicesBought routes


// const boughtService = await User.findByIdAndUpdate(userId, {
// 	$push: {
// 		servicesBought: addToCart._id,
// 	},
// });

module.exports = router;
