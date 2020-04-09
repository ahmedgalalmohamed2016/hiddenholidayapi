const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const superAdminMiddleware = require('../middleware/superAdmin');
const countryController = require('../controllers/country.controller');

router.get('/list', countryController.getCountries);
router.get('/list/all', countryController.getAllCountries);
router.post('/admin/create', countryController.create);
router.post('/admin/list', countryController.adminGetCountries);

router.post('/admin/country', countryController.getCountry);
router.post('/admin/update', countryController.updateCountry);



module.exports = router;