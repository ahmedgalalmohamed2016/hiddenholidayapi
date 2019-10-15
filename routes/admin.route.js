const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const superAdminMiddleware = require('../middleware/merchant');
const merchantController = require('../controllers/admin/merchants.controller');
const categoriesController = require('../controllers/admin/merchants.controller');

router.post('/merchants', merchantController.merchants);
// router.post('/categories/create', categoriesController.create);

module.exports = router;