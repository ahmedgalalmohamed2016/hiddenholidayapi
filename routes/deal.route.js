const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const deal_controller = require('../controllers/deal.controller');
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');

router.get('/', deal_controller.deals);
router.get('/bids', deal_controller.bids);
router.post('/cart', deal_controller.cart);
router.post('/admin/merchant', middleware.mainAuth, merchantMiddleware.merchantAuth, deal_controller.MerchantDeals);
router.post('/me/deal', middleware.mainAuth, deal_controller.DealData);
router.post('/admin/deal', middleware.mainAuth, adminMiddleware.adminAuth, deal_controller.AdminDealData);
router.post('/merchants/me/active', middleware.mainAuth, merchantMiddleware.merchantAuth, deal_controller.ActiveDealRequests);
router.post('/user/me', middleware.mainAuth, deal_controller.UserDealRequests);
router.post('/merchant/me', middleware.mainAuth, merchantMiddleware.merchantAuth, deal_controller.MerchantDeals);


router.post('/request', middleware.mainAuth, deal_controller.requestDeal);
router.post('/request/details', middleware.mainAuth, deal_controller.RequestData);

router.post('/history', middleware.mainAuth, deal_controller.history);
// router.get('/deal', deal_controller.DealByMerchantById);

module.exports = router;