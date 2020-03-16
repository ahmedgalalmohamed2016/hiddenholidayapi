const MerchantModel = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const DealModel = require('../models/deal.model');
const CardModel = require('../models/card.model');
const CategoryModel = require('../models/categories.model');
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



exports.adminCreateDeal = async(req, res) => {
    try {

        let _merchant = await MerchantModel.findById({ _id: req.body.id });
        if (!_merchant)
            return res.status(405).send("Please enter valid merchant data");

        let _category = await CategoryModel.findById({ _id: req.body.categoryId });
        if (!_category)
            return res.status(405).send("Please enter valid category data");

        let deal = {};
        deal.merchantId = req.body.id;
        deal.categoryId = _category._id;
        deal.countryId = _merchant.countryId;
        deal.title = req.body.title;
        deal.description = req.body.description;
        deal.country = _merchant.country;
        deal.currency = req.body.currency;
        deal.type = 'deal';
        deal.originalPrice = req.body.originalPrice;
        deal.newPrice = req.body.newPrice;
        deal.timeUsed = req.body.timeUsed;
        deal.discountPercentage = req.body.discountPercentage;
        deal.creationDate = new Date();
        deal.sharePercentage = req.body.sharePercentage;
        deal.titleAr = req.body.titleAr;
        deal.descriptionAr = req.body.descriptionAr;
        deal.maximumDays = req.body.maximumDays;
        deal.isActive = true;

        let dealData = await DealModel.create(deal);
        if (_.isNil(dealData))
            return res.status(401).send("Can not create this deal.");

        return res.send({ data: "Deal Created Success." });
    } catch (err) {
        console.log(err);
        return res.status(405).send({ data: "Please Try in another time", error: err });
    }
}

exports.adminCreateBid = async(req, res) => {
    try {

        let _merchant = await MerchantModel.findById({ _id: req.body.id });
        if (!_merchant)
            return res.status(405).send("Please enter valid merchant data");

        let _category = await CategoryModel.findById({ _id: req.body.categoryId });
        if (!_category)
            return res.status(405).send("Please enter valid category data");

        let deal = {};
        deal.merchantId = req.body.id;
        deal.categoryId = _category._id;
        deal.countryId = _merchant.countryId;
        deal.title = req.body.title;
        deal.description = req.body.description;
        deal.country = _merchant.country;
        deal.currency = req.body.currency;
        deal.type = 'bid';
        deal.originalPrice = req.body.originalPrice;
        deal.newPrice = req.body.newPrice;
        deal.timeUsed = req.body.timeUsed;
        deal.discountPercentage = req.body.discountPercentage;
        deal.creationDate = new Date();
        deal.sharePercentage = req.body.sharePercentage;
        deal.titleAr = req.body.titleAr;
        deal.descriptionAr = req.body.descriptionAr;
        deal.maximumDays = req.body.maximumDays;
        deal.isActive = true;

        let dealData = await DealModel.create(deal);
        if (_.isNil(dealData))
            return res.status(401).send("Can not create this deal.");

        return res.send({ data: "Deal Created Success." });
    } catch (err) {
        console.log(err);
        return res.status(405).send({ data: "Please Try in another time", error: err });
    }
}

exports.deals = async(req, res) => {
    try {

        if (!req.query.country)
            return res.status(405).send("Please enter valid country data");
        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await DealModel.find({ isArchived: false, country: req.query.country, type: 'deal' }).populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
        if (!dealsData)
            return res.status(405).send("Please enter data");
        res.send(dealsData);
    } catch (err) {
        return res.send(err);
    }
}

exports.bids = async(req, res) => {
    try {

        if (!req.query.country)
            return res.status(405).send("Please enter valid country data");
        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await DealModel.find({ isArchived: false, country: req.query.country, type: 'bid' }).populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
        if (!dealsData)
            return res.status(405).send("Please enter data");
        res.send(dealsData);
    } catch (err) {
        return res.send(err);
    }
}

exports.cart = async(req, res) => {
    try {
        if (!req.body.ids)
            return res.status(405).send("Please enter valid cart id");
        let ids = [];

        for (let x = 0; x < req.body.ids.length; x++) {
            let valu = new mongoose.Types.ObjectId(req.body.ids[x]);
            ids.push(valu);
        }
        console.log(ids);
        let dealsData = await DealModel.find({
            _id: { $in: ids },
            isArchived: false
        }).populate('categoryId').orFail((err) => Error(err));
        if (!dealsData)
            return res.status(405).send("Please enter data");
        res.send(dealsData);
    } catch (err) {
        return res.send(err);
    }
}

exports.MerchantDeals = async(req, res) => {
    try {
        if (!req.body.merchantId)
            return res.status(405).send("Please enter valid merchant id");

        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await DealModel.find({ merchantId: req.body.merchantId, type: 'deal' }).populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
        if (!dealsData)
            return res.status(405).send("Please enter valid data");
        res.send(dealsData);
    } catch (err) {
        return res.send(err);
    }
}

exports.MerchantBids = async(req, res) => {
    try {
        if (!req.body.merchantId)
            return res.status(405).send("Please enter valid merchant id");

        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await DealModel.find({ merchantId: req.body.merchantId, type: 'bid' }).populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
        if (!dealsData)
            return res.status(405).send("Please enter valid data");
        res.send(dealsData);
    } catch (err) {
        return res.send(err);
    }
}

exports.request = async(req, res) => {
    try {

    } catch (err) {
        return res.send({ data: err });
    }
}

// exports.request = async(req, res) => {
//     try {
//         if (!req.body.id)
//             res.status(405).send("please enter valid data");

//         let _merchant = await MerchantModel.findById({ _id: req.body.id }).populate('userId');
//         if (!_merchant)
//             return res.status(405).send("Please enter valid merchant data");
//         if (!_merchant.promotion)
//             res.status(405).send("Merchant doe not have any pormotion");

//         let _checkDeal = await DealModel.findOne({ userId: req.userData._id, merchantId: _merchant._id });
//         if (_checkDeal && _checkDeal.status == 'pending')
//             return res.send({ deal: _checkDeal, requested: "you can not request deal multible time" });

//         let dealObj = {};
//         dealObj.title = _merchant.promotion.title;
//         dealObj.description = _merchant.promotion.description;
//         dealObj.type = _merchant.promotion.type;
//         dealObj.amount = _merchant.promotion.amount;
//         dealObj.price = _merchant.promotion.price;
//         dealObj.usersType = _merchant.promotion.usersType;
//         dealObj.subscriptionFees = _merchant.promotion.subscriptionFees;
//         dealObj.sharePercentage = _merchant.promotion.sharePercentage;

//         dealObj.creationDate = new Date();
//         dealObj.merchantId = _merchant._id;
//         dealObj.userId = req.userData._id;

//         let _a = String(Math.floor(Math.random() * 10));
//         let _b = String(Math.floor(Math.random() * 10));
//         let _c = String(Math.floor(Math.random() * 10));
//         let _d = String(Math.floor(Math.random() * 10));
//         let verificationCode = _a + _b + _c + _d;

//         dealObj.verificationCode = verificationCode;
//         dealObj.comment = req.body.comment || null;
//         dealObj.status = "pending";

//         let _deal = await DealModel.create(dealObj);
//         if (_.isNil(_deal))
//             return res.status(405).send("error Happened");

//         let _socketObj = {};
//         _socketObj.title = req.userData.firstName + ' ' + req.userData.lastName + 'New Deal Request';
//         _socketObj.data = _deal;
//         // req.io.to(_merchant.userId.socketId).emit('newMessage', _socketObj);
//         // req.io.emit('newMessage', req.userData.firstName + ' ' + req.userData.lastName + 'New Deal Request');

//         return res.send(_deal);
//     } catch (err) {
//         return res.send({ data: err });
//     }
// }




exports.DealData = async(req, res) => {
    try {
        if (!req.body.id)
            res.status(405).send("please enter valid data");

        let _deal = await DealModel.findById({ _id: req.body.id, isArchived: false });
        if (!_deal)
            return res.status(405).send("Please enter valid deal data");
        return res.send(_deal);
    } catch (err) {
        return res.send("Error Happened");
    }
}

exports.AdminDealData = async(req, res) => {
    try {
        if (!req.body.id)
            res.status(405).send("please enter valid data");

        let _deal = await DealModel.findById({ _id: req.body.id, isArchived: false });
        if (!_deal)
            return res.status(405).send("Please enter valid deal data");
        return res.send(_deal);
    } catch (err) {
        return res.send("Error Happened");
    }
}

exports.DealRequests = async(req, res) => {
    try {
        let _query = {};
        _query.merchantId = req.merchantData._id;
        if (req.body.dealsType == 'pending')
            _query.status = 'pending';
        else {
            _query.status = { $ne: 'pending' }
        }

        let _checkDeal = await DealModel.find(_query).sort('-creationDate').populate('userId');
        if (_checkDeal)
            return res.send({ deal: _checkDeal, merchant: req.merchantData });
        return res.send({ deal: [], merchant: req.merchantData });
    } catch (err) {
        return res.send("Error Happened");
    }
}


exports.history = async(req, res) => {
    try {
        let _checkDeal = await DealModel.find({ userId: req.userData._id }).populate('merchants');
        if (_checkDeal)
            return res.send(_checkDeal);
        return res.send({});
    } catch (err) {
        return res.send("Error Happened");
    }
}