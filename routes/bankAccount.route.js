const express = require('express');
const router = express.Router();
const bankAccountController = require('../controllers/bankAccount.controller');
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');
const userMiddleware = require('../middleware/user');
const deal_controller = require('../controllers/deal.controller');


router.post('/create', middleware.mainAuth, middleware.useAsAdminAuth, merchantMiddleware.merchantAuth, bankAccountController.create);
router.post('/details', middleware.mainAuth, middleware.useAsAdminAuth, merchantMiddleware.merchantAuth, bankAccountController.details);
router.post('/delete', middleware.mainAuth, middleware.useAsAdminAuth, merchantMiddleware.merchantAuth, bankAccountController.delete);
// router.post('/admin/update', middleware.mainAuth,  merchantMiddleware.merchantAuth, bidcontroller.adminUpdate);
router.post('/merchant/list', middleware.mainAuth, middleware.useAsAdminAuth, merchantMiddleware.merchantAuth, bankAccountController.merchantList);

module.exports = router;