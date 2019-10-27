const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const superAdminMiddleware = require('../middleware/superAdmin');
const categoryController = require('../controllers/category.controller');

router.get('/list', categoryController.getCategories);
router.post('/admin/create', categoryController.create);
router.post('/admin/list', categoryController.adminGetCategories);

router.post('/admin/category', categoryController.getCategory);
router.post('/admin/update', categoryController.updateCategory);



module.exports = router;