const merchant = require('../models/merchant.model');

exports.adminAuth = async function(req, res, next) {
    if (req.userData.role == 'admin' || req.userData.role == 'superAdmin') {
        return next()

    } else if (req.userData.role == 'merchant') {
        let _merchant = await merchant.findById({ _id: req.userData.merchant });
        if (!_merchant)
            return res.status(405).send({statusCode:405,message:"Please enter valid merchant data"});
        req.merchantData = _merchant;
        return next()
    } else if (req.userData.role == 'merchantAdmin') {
        let _merchant = await merchant.findOne({ userId: req.userData._id });
        if (!_merchant)
            return res.status(405).send({statusCode:405,message:"Please enter valid merchant data"});
        req.merchantData = _merchant;
        return next()
    } else {
        return res.status(401).send({statusCode:401,message:"You dont have authority to access this page"});
    }
}