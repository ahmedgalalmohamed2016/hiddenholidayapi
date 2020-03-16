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

exports.merchants = async(req, res) => {
    try {
        let data = {};
        let _skip = 0;
        let _query = {};
        if (req.body.name)
            _query.clean_name = { $regex: req.body.name, $options: "i" }

        if (req.body.cat_name)
            _query.cat_name = req.body.cat_name;

        if (req.body.skip)
            _skip = req.body.skip * 10;

        data.merchants = await merchant.find(_query).limit(10).skip(_skip).orFail((err) => Error(err));

        data.totalMerchants = await merchant.count(_query).orFail((err) => Error(err));
        data.totalSuccessDeals = await DealModel.count({ status: 'accept' }).orFail((err) => Error(err));
        data.totalPendingDeals = await DealModel.count({ status: 'pending' }).orFail((err) => Error(err));
        // data._deals = await merchant.find({ promotion: { $ne: null } }).limit(8).orFail((err) => Error(err));
        return res.send(data);
    } catch (err) {
        return res.send(err);
    }
};

exports.deals = async(req, res) => {
    try {
        let data = {};
        let _skip = 0;
        let _query = { type: 'deal' };
        if (req.body.name)
            _query.title = { $regex: req.body.name, $options: "i" }


        if (req.body.skip)
            _skip = req.body.skip * 10;

        data.merchants = await DealModel.find(_query).populate('merchantId').limit(10).skip(_skip).orFail((err) => Error(err));
        data.totalMerchants = await DealModel.count({ type: 'deal' }).orFail((err) => Error(err));

        return res.send(data);
    } catch (err) {
        return res.send(err);
    }
};

exports.bids = async(req, res) => {
    try {
        let data = {};
        let _skip = 0;
        let _query = { type: 'bid' };
        if (req.body.name)
            _query.title = { $regex: req.body.name, $options: "i" }


        if (req.body.skip)
            _skip = req.body.skip * 10;

        data.merchants = await DealModel.find(_query).populate('merchantId').limit(10).skip(_skip).orFail((err) => Error(err));
        data.totalMerchants = await DealModel.count({ type: 'bid' }).orFail((err) => Error(err));

        return res.send(data);
    } catch (err) {
        return res.send(err);
    }
};