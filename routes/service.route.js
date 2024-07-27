const router = require('express').Router();
const Service = require('../models/Service.model');
const User = require('../models/User.model')

router.post('/services', async (req, res, next) => {
    try {
        const {serviceName, serviceDescription, quantity, date, img, category, createdBy} = req.body;

        // create a new service
        const newService = await Service.create({
            serviceName,
            serviceDescription,
            quantity,
            date,
            img,
            category,
            createdBy
        });

        // add the service to the user
        const offeredService = await User.findByIdAndUpdate(createdBy, {
            $push: {
                services: newService._id // adding Id of a new service to the user
            }
        });

        res.status(201).json(newService)

    } catch (error) {
        console.error(error)
    }
})


module.exports = router;