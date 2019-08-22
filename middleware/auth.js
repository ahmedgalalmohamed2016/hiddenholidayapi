const _ = require('lodash');
const UserModel = require('../models/user.model');
const tokenService = require('../services/tokenService');

exports.mainAuth = async function (req, res, next) {
    if (!req.body.userDevice || !req.body.mauth) {
        return res.status(401).send("You need to login to access this page");
    } else if (req.body.userDevice && req.body.mauth) {

        try {
            let _user = await UserModel.findOne({ userToken: req.body.mauth });
            if (_.isNil(_user))
                return res.status(401).send("Token is not valid");
            if (_user.isLocked)
                return res.status(401).send("user Account Is Locked");

            // if (_user.verifiedMobileNumber)
            //     return res.movo(200, "Account Alreadey Verified", _user);

            let _token = await tokenService.verifyLoginToken(req.body.userDevice, _user._id, req.body.mauth);
            if (_.isNil(_token))
                return res.status(401).send("You need to login to access this page");

            if (_token.userId != _user._id)
                return res.status(401).send("You need to login to access this page");
            req.userData = _user;
            return next()

        } catch (err) {
            return res.status(401).send("You need to login to access this page");
        }
    } else {
        return res.status(401).send("You need to login to access this page");
    }

}