const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');
const merchantController = require('../controllers/admin/merchants.controller');
const mainController = require('../controllers/admin/main.controller');
const deal_controller = require('../controllers/deal.controller');
const merchantAdminController = require('../controllers/merchantAdmin.controller');


router.post('/changePassword',  middleware.mainAuth, adminMiddleware.adminAuth, merchantAdminController.adminChangePassword);
//middleware.mainAuth, adminMiddleware.adminAuth, 
router.post('/users', middleware.mainAuth, adminMiddleware.adminAuth, merchantAdminController.adminGetMerchantAdmins);
router.post('/create', middleware.mainAuth, adminMiddleware.adminAuth, merchantAdminController.adminCreateMerchantAdmin);
router.post('/getUser', middleware.mainAuth, adminMiddleware.adminAuth, merchantAdminController.adminGetUserById);
router.post('/update', middleware.mainAuth, adminMiddleware.adminAuth, merchantAdminController.adminUpdateUser);

module.exports = router;