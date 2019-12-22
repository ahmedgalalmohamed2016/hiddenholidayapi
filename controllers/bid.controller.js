const MerchantModel = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const DealModel = require('../models/deal.model');
const BidModel = require('../models/bid.model');
const VerificationModel = require('../models/verification.model');
const passwordService = require('../services/passwordService');
const sendSmsService = require('../services/sendSmsService');
const tokenService = require('../services/tokenService');
const superagent = require('superagent');
const _ = require("lodash");
const request = require("superagent");
const fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

exports.adminCreate = async(req, res) => {
    try {
        let data = {};
        data.title = req.body.title;
        data.description = req.body.description;
        data.amount = req.body.amount;
        data.price = req.body.price;
        data.sharePercentage = req.body.sharePercentage;
        data.isActive = true;
        data.startDate = req.body.startDate;
        data.endDate = req.body.endDate;
        data.merchantId = req.body.merchantId;
        data.creationDate = new Date();

        let _merchant = await MerchantModel.findOne({ _id: req.body.merchantId }).populate('packageId');
        if (!_merchant || !_merchant.categoryId)
            return res.status(405).send("No merchant found with this data");

        let _totalBids = await BidModel.count({ merchantId: req.body.merchantId });

        console.log(_merchant.packageId.maxBids + '  ' + _totalBids);
        if (_merchant.packageId.maxBids <= _totalBids)
            return res.status(405).send("Merchant have maximum limit on bids, please upgrade plan");

        data.categoryId = _merchant.categoryId;

        let _res = await BidModel.create(data);
        if (!_res)
            return res.status(405).send("Can not create bid,try i another time.");
        return res.send({ data: data, t: _totalBids, p: _merchant.packageId });
    } catch (err) {
        return res.send("Error Happened");
    }
}