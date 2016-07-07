var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlResult = require('../controllers/result');
//var yelpRequest = require('../controllers/yelpRequest');

router.get('/', ctrlMain.default);
//router.get('/result', ctrlResult.default);
/*router.post('/ask', function (req, res, next) {
  console.log('Request URL:', req.originalURL);
  next();
}, function (req, res, next) {
    console.log('City:', req.params.city);
    next();
}, ctrlResult.yelpRequest, ctrlResult.default);*/
router.post('/result',
  ctrlResult.default2
  );



module.exports = router;
