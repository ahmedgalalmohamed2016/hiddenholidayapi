const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const TransactionController = require('../controllers/transaction.controller');
const middleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const userMiddleware = require('../middleware/user');
const card_controller = require('../controllers/card.controller');
const wallet_controller = require('../controllers/wallet.controller');

router.post('/user/addFund', middleware.mainAuth, userMiddleware.userAuth, wallet_controller.userAddFund);
router.post('/admin/merchant/balance', middleware.mainAuth, adminMiddleware.adminAuth, wallet_controller.adminMerchantBalance);
router.post('/main/balance', middleware.mainAuth, adminMiddleware.adminAuth, wallet_controller.hiddenHolidayBalance);


module.exports = router;