const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const superAdminMiddleware = require('../middleware/superAdmin');
const currencyController = require('../controllers/currency.controller');

router.get('/admin/create',currencyController.create);
router.post('/admin/update',currencyController.update);
router.get('/admin/get', currencyController.getCurrencies);

module.exports = router;