const express = require('express');
const router = express.Router();
const bankAccountController = require('../controllers/bankAccount.controller');
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');
const userMiddleware = require('../middleware/user');
const deal_controller = require('../controllers/deal.controller');


router.post('/create', middleware.mainAuth, merchantMiddleware.merchantAuth, bankAccountController.create);
// router.post('/admin/update', middleware.mainAuth,  merchantMiddleware.merchantAuth, bidcontroller.adminUpdate);
router.post('/merchant/list', middleware.mainAuth, merchantMiddleware.merchantAuth, bankAccountController.merchantList);
// router.post('/admin/bid', middleware.mainAuth,  merchantMiddleware.merchantAuth, bidcontroller.adminGetBid);
// router.post('/admin/merchant', middleware.mainAuth, adminMiddleware.adminAuth, bidcontroller.adminListbyMerchantId);
// router.get('/', bidcontroller.list);
// router.post('/admin/merchant', middleware.mainAuth, merchantMiddleware.merchantAuth, deal_controller.MerchantBids);


module.exports = router;