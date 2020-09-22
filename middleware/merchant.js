const merchant = require('../models/merchant.model');
const _ = require('lodash');
const UserModel = require('../models/user.model');
const tokenService = require('../services/tokenService');

exports.merchantAuth = async function(req, res, next) {
    if (req.userData.role != 'admin' && req.userData.role != 'merchantAdmin' && req.userData.role != 'superAdmin' && req.userData.role != 'merchant' &&
        req.userData.role != 'merchantUser') {
        return res.status(401).send({statusCode:401,message:"You dont have authority to access this page"});
    }

    console.log(req.userData.role);
    if (req.userData.role != 'merchant' && req.userData.role != 'merchantUser') {
        if (!req.body.merchantId) {
            return res.status(405).send("Please enter valid merchant data");
        } else {
            req.userData.merchant = req.body.merchantId;
            console.log("--------------admin");
        }
    }

    let _merchant = await merchant.findById({ _id: req.userData.merchant }).populate('countryId');
    if (!_merchant)
        return res.status(405).send("Please enter valid merchant data");

    req.merchantData = _merchant;

    // console.log(req.merchantData);
    return next()
}