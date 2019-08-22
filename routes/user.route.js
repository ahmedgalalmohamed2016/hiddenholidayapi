const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/user.controller');
const middleware = require('../middleware/auth');

router.post('/register', user_controller.register);
router.post('/login', user_controller.login);
router.post('/logout', middleware.mainAuth, user_controller.logout);

router.post('/profile', middleware.mainAuth, user_controller.getUserData);
router.post('/verifyPhone', middleware.mainAuth, user_controller.verifyPhone);
router.post('/verifyPhone/resendSms', middleware.mainAuth, user_controller.resendSms);


module.exports = router;
//