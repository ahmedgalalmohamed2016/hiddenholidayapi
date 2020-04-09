const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const merchantUserController = require('../controllers/merchantUser.controller');
const middleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const merchantMiddleware = require('../middleware/merchant');

router.post('/assign', middleware.mainAuth, adminMiddleware.adminAuth, merchantUserController.assign);
router.post('/me', middleware.mainAuth, merchantMiddleware.merchantAuth, merchantUserController.merchantData);
router.post('/deals', middleware.mainAuth, merchantMiddleware.merchantAuth, merchantUserController.deals);
router.post('/deals/update', middleware.mainAuth, merchantMiddleware.merchantAuth, merchantUserController.updateRequest);

module.exports = router;