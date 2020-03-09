const merchant = require('../models/merchant.model');

exports.merchantAuth = async function(req, res, next) {
    if (req.userData.role != 'admin' && req.userData.role != 'superAdmin' && req.userData.role != 'merchant' &&
        req.userData.role != 'merchantUser') {
        return res.status(401).send("You dont have authority to access this page");
    }

    if (req.userData.role != 'merchant') {
        if (!req.body.merchantId) {
            return res.status(405).send("Please enter valid merchant data");
        } else {
            req.userData.merchant = req.body.merchantId;
        }
    }

    let _merchant = await merchant.findById({ _id: req.userData.merchant });

    if (!_merchant)
        return res.status(405).send("Please enter valid merchant data");

    req.merchantData = _merchant;

    return next()
}