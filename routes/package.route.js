const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const superAdminMiddleware = require('../middleware/superAdmin');
const packageController = require('../controllers/package.controller');

router.get('/list', packageController.getPackage);
router.post('/admin/create', packageController.create);
router.post('/admin/list', packageController.adminGetPackages);

router.post('/admin/package', packageController.getPackage);
router.post('/admin/update', packageController.updatePackage);

module.exports = router;