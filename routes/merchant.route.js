const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const merchant_controller = require('../controllers/merchant.controller');
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');

// a simple test url to check that all of our files are communicating correctly.
router.get('/prepare', merchant_controller.merchant_prepare);
router.get('/home', merchant_controller.home);
router.post('/create', merchant_controller.create);
router.get('/maps', merchant_controller.maps);
router.get('/merchantsById', merchant_controller.merchantById);
router.post('/me', middleware.mainAuth, merchantMiddleware.merchantAuth, merchant_controller.me);
router.get('/', merchant_controller.merchants);
router.post('/favourites', merchant_controller.merchants_favourites);
router.post('/updates', merchant_controller.updateMerchant);
// router.get('/updates/dummy', merchant_controller.updateDummyMerchant);
router.get('/airports', merchant_controller.getAirports);

module.exports = router;