const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');


// GET by Id

router.get('/user/:userId', async (req, res, next) => {
	try {
		const { userId } = req.params;
		const user = await User.findById(userId)
			.populate('servicesBought')
			.populate('servicesOffered')
			.populate('comments')

		res.status(200).json(user);
	} catch (error) {
		console.error(error);
	}
});

// Update by Id

router.put('/user/:userId', async (req, res, next) => {
	try {
		const { userId } = req.params;
		const { email, password, typeOfUser, name, img } = req.body;

        		// check if password is valid
		const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/; // {min amount, max amount}

        
		if (!passwordRegex.test(password)) {
            res.status(400).json({
                message:
                'Your password needs to contain at least a number, a lowercase letter, an uppercase letter and have at least 6 characters',
			});
			return;
		}

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);


		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				email,
				password: hashedPassword,
				typeOfUser,
				name,
				img,
			},
			{ new: true },
		);

		res.status(200).json(updatedUser);
	} catch (error) {
		console.error(error);
	}
});

// Delete

router.delete('/user/:userId', async (req, res, next) => {
	try {
		const { userId } = req.params;
		await User.findOneAndDelete(userId);

		res.status(204).send();
	} catch (error) {
		console.error(error);
	}
});

module.exports = router;
