const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/user.controller');
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');
const wallet_controller = require('../controllers/wallet.controller');
const card_controller = require('../controllers/card.controller');

router.post('/register', user_controller.register);
router.post('/login', user_controller.login);
router.post('/login/admin', user_controller.loginAdmin);
router.post('/logout', middleware.mainAuth, user_controller.logout);
router.post('/updatesocket', middleware.mainAuth, user_controller.updateSocket);
router.get('/countries', user_controller.getCountries);
router.get('/categories', user_controller.getCategories);
router.post('/balance', middleware.mainAuth, wallet_controller.userBalance);
router.post('/card/get', middleware.mainAuth, card_controller.cards);
router.post('/checkPassword', middleware.mainAuth, user_controller.checkPassword);


router.post('/admin/changePassword',  middleware.mainAuth, adminMiddleware.adminAuth, user_controller.adminChangePassword);
router.post('/admin/users',  middleware.mainAuth, adminMiddleware.adminAuth, user_controller.adminGetUsers);
router.post('/admin/create',  middleware.mainAuth, adminMiddleware.adminAuth, user_controller.adminCreateUser);
router.post('/admin/getUser',  middleware.mainAuth, adminMiddleware.adminAuth, user_controller.adminGetUserById);
router.post('/admin/update',  middleware.mainAuth, adminMiddleware.adminAuth, user_controller.adminUpdateUser);


router.post('/profile', middleware.mainAuth, user_controller.getUserData);
router.post('/profileEdite', middleware.mainAuth, user_controller.profileEdite);
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