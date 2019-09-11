const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const merchant_controller = require('../controllers/merchant.controller');
const middleware  = require('../middleware/auth');

// a simple test url to check that all of our files are communicating correctly.
router.get('/prepare', merchant_controller.merchant_prepare);
router.get('/home', merchant_controller.home);
router.get('/maps', merchant_controller.maps);
router.get('/merchantsById', merchant_controller.merchantById);
router.get('/', merchant_controller.merchants);
router.post('/favourites', merchant_controller.merchants_favourites);
router.post('/updates', merchant_controller.updateMerchant);
router.post('/updates/promotions', merchant_controller.updateDummyMerchant);
router.get('/airports', merchant_controller.getAirports);


module.exports = router;