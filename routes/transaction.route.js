const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const TransactionController = require('../controllers/transaction.controller');
const middleware = require('../middleware/auth');
const userMiddleware = require('../middleware/user');
const adminMiddleware = require('../middleware/admin');
const merchantMiddleware = require('../middleware/merchant');

router.post('/admin/list', middleware.mainAuth, adminMiddleware.adminAuth, TransactionController.getAll);
router.post('/merchant/me', middleware.mainAuth, TransactionController.me);
router.post('/admin/merchant', middleware.mainAuth, adminMiddleware.adminAuth, TransactionController.getByAdmin);

router.post('/details', middleware.mainAuth, TransactionController.details);

router.post('/user/me', middleware.mainAuth, TransactionController.me);
router.post('/main', middleware.mainAuth, adminMiddleware.adminAuth, TransactionController.hiddenHoliday);
router.post('/user', middleware.mainAuth, adminMiddleware.adminAuth, TransactionController.merchantById);
router.post('/merchant/balance', middleware.mainAuth, TransactionController.balance);

router.post('/user/bill/request', middleware.mainAuth, userMiddleware.userAuth, TransactionController.requestBill);
router.post('/merchant/bill', middleware.mainAuth, merchantMiddleware.merchantAuth, TransactionController.merchantGetBill);
router.post('/merchant/bill', middleware.mainAuth, merchantMiddleware.merchantAuth, TransactionController.merchantUpdateBill);


module.exports = router;