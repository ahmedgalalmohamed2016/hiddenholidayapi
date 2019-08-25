const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const deal_controller = require('../controllers/deal.controller');
const middleware = require('../middleware/auth');

router.get('/', deal_controller.deals);
router.post('/request', middleware.mainAuth, deal_controller.request);
router.post('/update', middleware.mainAuth, deal_controller.update);
router.post('/history', middleware.mainAuth, deal_controller.history);
router.get('/Demodeals', deal_controller.Demodeals);


module.exports = router;