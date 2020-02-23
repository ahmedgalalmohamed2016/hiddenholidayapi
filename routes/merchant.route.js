const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const merchant_controller = require('../controllers/merchant.controller');
const wallet_controller = require('../controllers/wallet.controller');
const card_controller = require('../controllers/card.controller');
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');

// a simple test url to check that all of our files are communicating correctly.
// router.get('/prepare', merchant_controller.merchant_prepare);
router.get('/home', merchant_controller.home);
router.post('/create', merchant_controller.create);
router.post('/card/add', middleware.mainAuth, merchantMiddleware.merchantAuth, card_controller.add);

router.post('/fund/add', middleware.mainAuth, merchantMiddleware.merchantAuth, wallet_controller.merchantAddFund);

router.post('/card/get', middleware.mainAuth, merchantMiddleware.merchantAuth, card_controller.cards);
router.post('/card/remove', middleware.mainAuth, merchantMiddleware.merchantAuth, card_controller.delete);

router.post('/checkPassword', middleware.mainAuth, merchantMiddleware.merchantAuth, merchant_controller.checkPassword);


router.get('/maps', merchant_controller.maps);
router.get('/merchantsById', merchant_controller.merchantById);
router.post('/admin/merchantsById', middleware.mainAuth, adminMiddleware.adminAuth, merchant_controller.adminMerchantById);

router.post('/me', middleware.mainAuth, merchantMiddleware.merchantAuth, merchant_controller.me);
router.post('/balance', middleware.mainAuth, merchantMiddleware.merchantAuth, wallet_controller.balance);
router.post('/me/totalDeals', middleware.mainAuth, merchantMiddleware.merchantAuth, merchant_controller.totalDeals);
router.post('/me/update', middleware.mainAuth, merchantMiddleware.merchantAuth, merchant_controller.update);
router.get('/', merchant_controller.merchants);
router.post('/favourites', merchant_controller.merchants_favourites);


router.post('/admin/create', middleware.mainAuth, adminMiddleware.adminAuth, merchant_controller.adminCreate);
router.post('/admin/update', middleware.mainAuth, adminMiddleware.adminAuth, merchant_controller.adminUpdate);

module.exports = router;