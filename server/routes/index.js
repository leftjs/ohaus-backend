var express = require('express');
var router = express.Router();
import { uploadMiddleware, uploadSingleWithFile } from '../utils/ossUtils'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

router.post('/upload/single', uploadMiddleware.single('file'), (req,res,next) => {
	uploadSingleWithFile(req.file).then((result) => {
		console.log('result', result)
		res.json(result)
	}).catch((err) => {
		return next(customError(400,err.message))
	})
})

module.exports = router;
