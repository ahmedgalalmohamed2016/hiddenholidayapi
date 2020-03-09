const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const deal_controller = require('../controllers/deal.controller');
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');

router.get('/', deal_controller.deals);
router.post('/request', middleware.mainAuth, deal_controller.request);
router.post('/request/decline', middleware.mainAuth, merchantMiddleware.merchantAuth, deal_controller.decline);
router.post('/history', middleware.mainAuth, deal_controller.history);
router.get('/deal', deal_controller.DealByMerchantById);
router.post('/me/deal', middleware.mainAuth, deal_controller.DealData);
router.post('/merchants/me', middleware.mainAuth, merchantMiddleware.merchantAuth, deal_controller.DealRequests);

router.post('/me/cancel', middleware.mainAuth, deal_controller.cancel);
router.post('/me/accept', middleware.mainAuth, deal_controller.accept);
router.post('/me/create', middleware.mainAuth, merchantMiddleware.merchantAuth, deal_controller.createDeal);
router.post('/me/update', middleware.mainAuth, merchantMiddleware.merchantAuth, deal_controller.updateDeal);


router.post('/admin/deal', middleware.mainAuth, adminMiddleware.adminAuth, deal_controller.AdminDealData);
router.post('/admin/merchant', middleware.mainAuth, merchantMiddleware.merchantAuth, deal_controller.MerchantDeals);

router.get('/Demodeals', deal_controller.Demodeals);


module.exports = router;