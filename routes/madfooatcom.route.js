const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const madfooatcomController = require('../controllers/madfooatcom.controller');
const wallet_controller = require('../controllers/wallet.controller');
const card_controller = require('../controllers/card.controller');
const middleware = require('../middleware/auth');
const merchantMiddleware = require('../middleware/merchant');
const adminMiddleware = require('../middleware/admin');

router.get('/', madfooatcomController.wellcom);
router.post('/refrance/detail', madfooatcomController.detail);

module.exports = router;