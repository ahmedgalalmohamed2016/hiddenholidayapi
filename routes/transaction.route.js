const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const TransactionController = require('../controllers/transaction.controller');
const middleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post('/admin/list', middleware.mainAuth, adminMiddleware.adminAuth, TransactionController.getAll);
router.post('/merchant/me', middleware.mainAuth, TransactionController.me);
router.post('/user/me', middleware.mainAuth, TransactionController.me);
router.post('/merchant/balance', middleware.mainAuth, TransactionController.balance);



module.exports = router;