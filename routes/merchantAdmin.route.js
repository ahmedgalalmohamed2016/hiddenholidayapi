const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');
const adminAndMerchantMiddleware = require('../middleware/adminAndMerchant');
const merchantController = require('../controllers/admin/merchants.controller');
const mainController = require('../controllers/admin/main.controller');
const deal_controller = require('../controllers/deal.controller');
const merchantAdminController = require('../controllers/merchantAdmin.controller');


router.post('/changePassword',  middleware.mainAuth, adminMiddleware.adminAuth, merchantAdminController.adminChangePassword);
//middleware.mainAuth, adminMiddleware.adminAuth, 
router.post('/users', middleware.mainAuth, adminMiddleware.adminAuth, merchantAdminController.adminGetMerchantAdmins);
router.post('/create', merchantAdminController.adminCreateMerchantAdmin);
router.post('/getUser', middleware.mainAuth, adminMiddleware.adminAuth, merchantAdminController.adminGetUserById);
router.post('/getmerchants', middleware.mainAuth, adminAndMerchantMiddleware.adminAuth, merchantAdminController.adminMerchantsGetMerchants);
router.post('/update', middleware.mainAuth, adminMiddleware.adminAuth, merchantAdminController.adminUpdateUser);

router.post('/create/user', middleware.mainAuth, middleware.useAsAdminAuth, merchantMiddleware.merchantAuth, merchantAdminController.adminCreateMerchantUser);
router.post('/list/user', middleware.mainAuth, middleware.useAsAdminAuth, merchantMiddleware.merchantAuth, merchantAdminController.merchantUsers);


module.exports = router;