const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');
const merchantController = require('../controllers/admin/merchants.controller');
const mainController = require('../controllers/admin/main.controller');
const deal_controller = require('../controllers/deal.controller');
const ealbController = require('../controllers/ealb.controller');


router.post('/changePassword',  middleware.mainAuth, adminMiddleware.adminAuth, ealbController.adminChangePassword);
//middleware.mainAuth, adminMiddleware.adminAuth, 
router.post('/users', middleware.mainAuth, adminMiddleware.adminAuth, ealbController.adminGetUsers);
router.post('/create', middleware.mainAuth, adminMiddleware.adminAuth, ealbController.adminCreateUser);
router.post('/getUser', middleware.mainAuth, adminMiddleware.adminAuth, ealbController.adminGetUserById);
router.post('/update', middleware.mainAuth, adminMiddleware.adminAuth, ealbController.adminUpdateUser);

module.exports = router;