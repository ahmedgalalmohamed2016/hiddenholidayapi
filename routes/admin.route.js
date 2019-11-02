const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');
const merchantController = require('../controllers/admin/merchants.controller');
const categoriesController = require('../controllers/admin/merchants.controller');

router.post('/merchants', middleware.mainAuth, adminMiddleware.adminAuth, merchantController.merchants);
router.post('/deals', middleware.mainAuth, adminMiddleware.adminAuth, merchantController.deals);


module.exports = router;