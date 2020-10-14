const _ = require('lodash');
const UserModel = require('../models/user.model');
const tokenService = require('../services/tokenService');

exports.mainAuth = async function(req, res, next) {

    if (!req.body.userDevice || !req.body.mauth) {
        return res.status(401).send({ statusCode: 401,message:"You need to login to access this page"});
    } else if (req.body.userDevice && req.body.mauth) {

        try {
            let _user = await UserModel.findOne({ userToken: req.body.mauth });
            
            if (_.isNil(_user))
                return res.status(401).send({ statusCode: 401,message:"Token is not valid"});
            
         
            if (_user.isLocked != undefined && _user.isLocked)
                return res.status(401).send({ statusCode: 401,message:"user Account Is Locked"});

            let _token = await tokenService.verifyLoginToken(req.body.userDevice, _user._id, req.body.mauth);
               
            if (_.isNil(_token))
                return res.status(401).send({ statusCode: 401,message:"You need to login to access this page"});

            if (_token.userId != _user._id)
                return res.status(401).send({ statusCode: 401,message:"You need to login to access this page"});
            req.userData = _user;
            return next()

        } catch (err) {
            return res.status(401).send({ statusCode: 401,message:"You need to login to access this page"});
        }
    } else {
        return res.status(401).send({ statusCode: 401,message:"You need to login to access this page"});
    }

}

exports.useAsAdminAuth = async function(req, res, next) {
    try {
        if (req.userData.role == 'merchantAdmin') {
            if (!req.body.merchantId) {
                req.body.merchantId = req.userData._id
                // return res.status(401).send({statusCode:401,message:"You dont have authority to access this page"});
            }

            let _user = await UserModel.findOne({ merchant: req.body.merchantId });
            if (_.isNil(_user))
                return res.status(401).send({statusCode:401,message:"Token is not valid"});

            req.userData = _user;
            return next()
        } else {
            return next();
        }

    } catch (err) {
        return res.status(401).send({statusCode:401,message:"You need to login to access this page"});
    }


}