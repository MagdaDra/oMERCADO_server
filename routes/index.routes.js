const router = require('express').Router();
// importing what I did in cloudinary config
const fileUploader = require('../config/cloudinary.config');

router.get('/', (req, res, next) => {
	res.json('All good in here');
});
// it's used to upload a file
router.post(
	'/upload',
	fileUploader.single('imgUrl'),
	async (req, res, next) => {
		// req.file
		if (!req.file) {
			next(new Error('No file uploaded'));
			return;
		}
    // req.file.path is the url of the file in cloudinary
		res.json({ fileUrl: req.file.path });
	},
);

module.exports = router;
