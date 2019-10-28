const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/user.controller');
const middleware = require('../middleware/auth');

router.post('/register', user_controller.register);
router.post('/login', user_controller.login);
router.post('/login/admin', user_controller.loginAdmin);
router.post('/logout', middleware.mainAuth, user_controller.logout);
router.post('/updatesocket', middleware.mainAuth, user_controller.updateSocket);
router.get('/countries', user_controller.getCountries);
router.get('/categories', user_controller.getCategories);


router.post('/profile', middleware.mainAuth, user_controller.getUserData);
router.post('/verifyPhone', middleware.mainAuth, user_controller.verifyPhone);
router.post('/verifyPhone/resendSms', middleware.mainAuth, user_controller.resendSms);
router.post('/login/facebook', user_controller.loginFB);

//forget password
// reset password
// change password
//  facebook login

//create deal
//update deal
// get my deals

module.exports = router;
//