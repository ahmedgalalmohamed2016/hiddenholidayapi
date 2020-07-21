const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');
const merchantController = require('../controllers/admin/merchants.controller');
const mainController = require('../controllers/admin/main.controller');
const deal_controller = require('../controllers/deal.controller');
const adminController = require('../controllers/admin.controller');
const TransactionController = require('../controllers/transaction.controller');

router.post('/merchants', middleware.mainAuth, adminMiddleware.adminAuth, merchantController.merchants);
router.post('/deals', middleware.mainAuth, adminMiddleware.adminAuth, merchantController.deals);
router.post('/bids', middleware.mainAuth, adminMiddleware.adminAuth, merchantController.bids);

router.post('/dashboard', middleware.mainAuth, adminMiddleware.adminAuth, mainController.dashboard);
router.post('/deals/create', middleware.mainAuth, adminMiddleware.adminAuth, deal_controller.adminCreateDeal);
router.post('/bids/create', middleware.mainAuth, adminMiddleware.adminAuth, deal_controller.adminCreateBid);


router.post('/changePassword',  middleware.mainAuth, adminMiddleware.adminAuth, adminController.adminChangePassword);
//middleware.mainAuth, adminMiddleware.adminAuth, 
router.post('/users', middleware.mainAuth, adminMiddleware.adminAuth,  adminController.adminGetUsers);
router.post('/create', middleware.mainAuth, adminMiddleware.adminAuth,  adminController.adminCreateUser);
router.post('/getUser', middleware.mainAuth, adminMiddleware.adminAuth, adminController.adminGetUserById);
router.post('/update', middleware.mainAuth, adminMiddleware.adminAuth, adminController.adminUpdateUser);


router.post('/transaction/settled', TransactionController.settledTransaction);

module.exports = router;