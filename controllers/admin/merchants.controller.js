const merchant = require('../../models/merchant.model');
const UserModel = require('../../models/user.model');
const DealModel = require('../../models/deal.model');
const VerificationModel = require('../../models/verification.model');
const passwordService = require('../../services/passwordService');
const sendSmsService = require('../../services/sendSmsService');
const tokenService = require('../../services/tokenService');
// const AirportModel = require('.././models/airport.model');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

exports.merchants = async (req, res) => {
    try {
        let data = {};

        let _skip = 0;
        data.merchants = await merchant.find({}).limit(16).skip(_skip).orFail((err) => Error(err));

        data.totalMerchants = await merchant.count({}).orFail((err) => Error(err));
        data.totalSuccessDeals = await DealModel.count({status : 'accept'}).orFail((err) => Error(err));
        data.totalPendingDeals = await DealModel.count({status : 'pending'}).orFail((err) => Error(err));
        // data._deals = await merchant.find({ promotion: { $ne: null } }).limit(8).orFail((err) => Error(err));

        return res.send(data);
    } catch (err) {
        return res.send(err.message);
    }
};