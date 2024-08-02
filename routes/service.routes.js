const router = require('express').Router();
const Service = require('../models/Service.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model')

router.post('/services', async (req, res, next) => {
	try {
		const {
			serviceName,
			serviceDescription,
			price,
			quantity,
			date,
			img,
			category,
			createdBy,
		} = req.body;

		// create a new service
		const newService = await Service.create({
			serviceName,
			serviceDescription,
			price,
			quantity,
			date,
			img,
			category,
			createdBy,
		});

		// add the service offered to the user
		const offeredService = await User.findByIdAndUpdate(createdBy, {
			$push: {
				servicesOffered: newService._id, // adding Id of a new service to the user
			},
		});

		res.status(201).json(newService);
	} catch (error) {
		console.error(error);
	}
});

// GET all services

router.get('/services', async (req, res, next) => {
	try {
		const allServices = await Service.find();

		res.status(200).json(allServices);
	} catch (error) {
		console.error(error);
	}
});

// GET by Id

router.get('/services/:serviceId', async (req, res, next) => {
	try {
		const { serviceId } = req.params;
		const singleService = await Service.findById(serviceId);

		res.status(200).json(singleService);
	} catch (error) {
		console.error(error);
	}
});

// Update by Id

router.put('/services/:serviceId', async (req, res, next) => {
	try {
		const { serviceId } = req.params;
		const { serviceName, serviceDescription, quantity, date, img, category } =
			req.body;

		const updatedService = await Service.findByIdAndUpdate(
			serviceId,
			{
				serviceName,
				serviceDescription,
				quantity,
				date,
				img,
				category,
			},
			{ new: true }, // to get updated project
		);

		res.status(200).json(updatedService);
	} catch (error) {
		console.error(error);
	}
});

// Delete

router.delete('/services/:serviceId', async (req, res, next) => {
	try {
		const { serviceId } = req.params;
		await Service.findOneAndDelete(serviceId);

		res.status(204).send();
	} catch (error) {
		console.error(error);
	}
});

module.exports = router;