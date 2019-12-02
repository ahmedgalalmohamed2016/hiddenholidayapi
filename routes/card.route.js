const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const TransactionController = require('../controllers/transaction.controller');
const middleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const userMiddleware = require('../middleware/user');
const card_controller = require('../controllers/card.controller');

router.post('/user/add', middleware.mainAuth, userMiddleware.userAuth, card_controller.add);
router.post('/user/get', middleware.mainAuth, userMiddleware.userAuth, card_controller.cards);
router.post('/user/remove', middleware.mainAuth, userMiddleware.userAuth, card_controller.delete);

module.exports = router;