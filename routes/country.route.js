const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const superAdminMiddleware = require('../middleware/superAdmin');
const countryController = require('../controllers/country.controller');

router.post('/admin/create',countryController.create);
router.post('/admin/get', middleware.mainAuth, superAdminMiddleware.superAdminAuth, countryController.getCountries);

module.exports = router;