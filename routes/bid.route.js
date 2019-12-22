const express = require('express');
const router = express.Router();
const bidcontroller = require('../controllers/bid.controller');
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');
const userMiddleware = require('../middleware/user');

router.post('/admin/create', middleware.mainAuth, adminMiddleware.adminAuth, bidcontroller.adminCreate);


module.exports = router;