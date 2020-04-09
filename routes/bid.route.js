const express = require('express');
const router = express.Router();
const bidcontroller = require('../controllers/bid.controller');
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');
const userMiddleware = require('../middleware/user');
const deal_controller = require('../controllers/deal.controller');

router.post('/admin/create', middleware.mainAuth, adminMiddleware.adminAuth, bidcontroller.adminCreate);
router.post('/admin/update', middleware.mainAuth, adminMiddleware.adminAuth, bidcontroller.adminUpdate);
router.post('/admin/list', middleware.mainAuth, adminMiddleware.adminAuth, bidcontroller.adminList);
router.post('/admin/bid', middleware.mainAuth, adminMiddleware.adminAuth, bidcontroller.adminGetBid);
// router.post('/admin/merchant', middleware.mainAuth, adminMiddleware.adminAuth, bidcontroller.adminListbyMerchantId);
router.get('/', bidcontroller.list);
router.post('/admin/merchant', middleware.mainAuth, merchantMiddleware.merchantAuth, deal_controller.MerchantBids);

module.exports = router;