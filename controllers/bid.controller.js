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
            return res.status(405).send({ statusCode: 405,message:"No merchant found with this data"});

        let _totalBids = await DealModel.count({ merchantId: req.body.merchantId, type: 'bid' });

        if (_merchant.packageId.maxBids <= _totalBids)
            return res.status(405).send({ statusCode: 405,message:"Merchant have maximum limit on bids, please upgrade plan"});

        if (!_merchant.country)
            return res.status(405).send({ statusCode: 405,message:"You must update merchant country before you create bid."});

        data.categoryId = _merchant.categoryId;
        data.country = _merchant.country;

        let _res = await DealModel.create(data);
        if (!_res)
            return res.status(405).send("Can not create bid,try i another time.");
        return res.status(200).send({ statusCode: 200,message:"Success",data:{ data: data, t: _totalBids, p: _merchant.packageId }});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
    }
}

exports.adminUpdate = async(req, res) => {
    try {
        let data = {};
        data.title = req.body.title;
        data.description = req.body.description;
        data.amount = req.body.amount;
        data.price = req.body.price;
        data.sharePercentage = req.body.sharePercentage;
        data.isActive = req.body.isActive;
        data.startDate = req.body.startDate;
        data.endDate = req.body.endDate;

        let _bid = await DealModel.findOne({ _id: req.body.id, type: 'bid' });
        if (!_bid)
            return res.status(405).send({ statusCode: 405,message:"No bid found with this data"});

        let _res = await DealModel.findOneAndUpdate({ _id: req.body.id }, { $set: data }, { new: true });
        if (!_res)
            return res.status(405).send({ statusCode: 405,message:"Can not update this bid,try i another time."});
        return res.status(200).send({ statusCode: 200,message:"Success",data:_res});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
    }
}

exports.adminList = async(req, res) => {
    try {

        let _query = {};

        if (req.body.startDate)
            _query.startDate = req.body.startDate;

        if (req.body.endDate)
            _query.endDate = req.body.endDate;

        let _skip = 0;
        if (req.body.page)
            _skip = req.body.page * 10;

        if (!req.body.name)
            req.body.name = '';

        let BidsData = await DealModel.find({
                $or: [{ title: { $regex: req.body.name, $options: "i" } },
                    { country: { $regex: req.body.name, $options: "i" } }
                ]
            }, _query)
            .populate('merchantId').populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
        if (!BidsData)
            return res.status(405).send({ statusCode: 405,message:"No bids found with this data."});
        return res.status(200).send({ statusCode: 200,message:"Success",data:BidsData});
    } catch (err) {
        return res.status(405).send({ statusCode: 405,message:"Error",data:err});
    }
}

exports.adminListbyMerchantId = async(req, res) => {
    try {

        let _bids = await DealModel.find({ merchantId: req.body.id }).sort('endDate')
            .populate('merchantId').populate('categoryId');
        if (!_bids)
            return res.status(405).send({ statusCode: 405,message:"No bids found with this data."});
        return res.status(200).send({ statusCode: 200,message:"Success",data:_bids});
    } catch (err) {
        return res.status(405).send({ statusCode: 405,message:"Can not find bank accounts.",data:err});
    }
}

exports.adminGetBid = async(req, res) => {
    try {
        if (!req.body.id) {
            return res.status(404).send({ statusCode: 404,message:"Error Happened"});
        }

        let bid = await DealModel.findOne({ _id: req.body.id, type: 'bid' });

        if (!bid) {
            return res.status(404).send({ statusCode: 404,message:"No bids found with this data."});
        }

        return res.status(200).send({ statusCode: 200,message:"Success",data:bid});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error",data:err});
    }
}

exports.list = async(req, res) => {
    try {

        if (!req.query.country)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid country data"});
        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await DealModel.find({ isArchived: false, country: req.query.country, type: 'bid' }).populate('merchantId').populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
        if (!dealsData)
            return res.status(404).send({ statusCode: 404,message:"Please enter data"});
        res.status(200).send({ statusCode: 200,message:"Success",data:dealsData});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error", data:err});
    }
}