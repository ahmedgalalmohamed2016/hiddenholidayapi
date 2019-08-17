const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const merchant_controller = require('../controllers/merchant.controller');
const middleware  = require('../middleware/auth');


// a simple test url to check that all of our files are communicating correctly.
router.get('/prepare', merchant_controller.merchant_prepare);
router.get('/maps', merchant_controller.maps);
router.get('/merchantsById', merchant_controller.merchantById);
router.get('/merchants', merchant_controller.merchants);
// router.get('/update', merchant_controller.updateMerchant);
// update



module.exports = router;