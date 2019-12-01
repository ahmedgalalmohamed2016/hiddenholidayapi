const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const superAdminMiddleware = require('../middleware/superAdmin');
const adminMiddleware = require('../middleware/admin');
const categoryController = require('../controllers/admin/categories.controller');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './public/categories' });

router.get('/list', categoryController.getCategories);
router.post('/upload', multipartMiddleware, categoryController.upload);

router.post('/admin/create', middleware.mainAuth, adminMiddleware.adminAuth, categoryController.create);
router.post('/admin/list', middleware.mainAuth, adminMiddleware.adminAuth, categoryController.adminGetCategories);

router.post('/admin/category', categoryController.getCategory);
router.post('/admin/update', middleware.mainAuth, adminMiddleware.adminAuth, categoryController.updateCategory);



module.exports = router;