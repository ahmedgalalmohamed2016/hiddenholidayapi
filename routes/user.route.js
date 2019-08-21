const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/user.controller');
const middleware = require('../middleware/auth');

router.post('/register', user_controller.register);
router.post('/profile', middleware.mainAuth, user_controller.getUserData);

module.exports = router;