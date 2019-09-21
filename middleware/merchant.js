const merchant = require('../models/merchant.model');

exports.merchantAuth = async function (req, res, next) {
    if (req.userData.role != 'merchant')
        return res.status(401).send("You dont have authority to access this page");

    let _merchant = await merchant.findById({ _id: req.userData.merchant });
    if (!_merchant)
        return res.status(405).send("Please enter valid merchant data");

    req.merchantData = _merchant;
    return next()


}