const MerchantModel = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const DealModel = require('../models/deal.model');
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

exports.Demodeals = async (req, res) => {
    try {
        let deal = {};
        // deal._id = "5d5737feac9c1a5e17a081d5";
        // deal.promotion_title =  r_title[Math.floor(Math.random() * r_title.length)];
        deal.promotion_title = "Get 30 USD discount any time in day";
        deal.promotion_description = "Get 30 USD discount any time when you Located at  Mecca Mall in Amman, Jordan Bowling & Billiard Center.. ";
        //percentage fixed
        deal.promotion_type = "fixed";
        deal.promotion_amount = "30";
        deal.promotion_start_date = new Date();
        var d = new Date();
        d.setMonth(11);
        deal.promotion_end_date = d;

        deal.promotion_for = "individuals";
        deal.promotion_subscription_fees = 40;
        deal.promotion_share_percentage = 10;
        //   delete deal._id;

        const updatedUser = await MerchantModel.updateOne({ clean_name: "Jordan Bowling" },
            { $set: { promotion: deal } }, { new: true });
        if (_.isNil(updatedUser) || updatedUser.length < 1)
            return res.status(405).send("Please enter data");
        return res.send(updatedUser);
    } catch (err) {
        return res.send({ data: "error" });
    }
}

exports.createDeal = async (req, res) => {
    try {
        let deal = {};
        deal.title = req.body.title;
        deal.description = req.body.description;
        //percentage fixed
        deal.type = req.body.type;
        deal.amount = req.body.amount;
        deal.price = req.body.price;

        deal.usersType = req.body.usersType;//"individual" "group";
        deal.subscriptionFees = "0";
        deal.sharePercentage = "0";

        if (req.merchantData.promotion)
            return res.status(402).send("You already have a deal contact support to modify it for you");

        const updatedMerchant = await MerchantModel.updateOne({ clean_name: req.merchantData.name },
            { $set: { promotion: deal, isActivePromotion: true, isVerifiedPromotion: false } }, { new: true });
        if (_.isNil(updatedMerchant) || updatedMerchant.length < 1)
            return res.status(405).send("We can not add your deal now.try in another time.");
        return res.send(updatedMerchant);
    } catch (err) {
        return res.send({ data: "Please Try in another time" });
    }
}

exports.updateDeal = async (req, res) => {
    try {
        let deal = {};
        deal.title = req.body.title;
        deal.description = req.body.description;
        //percentage fixed
        deal.type = req.body.type;
        deal.amount = req.body.amount;
        deal.price = req.body.price;

        deal.usersType = req.body.usersType;//"individual" "group";
        deal.subscriptionFees = "0";
        deal.sharePercentage = "0";

        if (!req.merchantData.promotion)
            return res.status(402).send("You don't have any deal you add first one now.");

        const updatedMerchant = await MerchantModel.updateOne({ clean_name: req.merchantData.name },
            { $set: { promotion: deal, isActivePromotion: true, isVerifiedPromotion: false } }, { new: true });
        if (_.isNil(updatedMerchant) || updatedMerchant.length < 1)
            return res.status(405).send("We can not update your deal.Try in another time.");
        return res.send(updatedMerchant);
    } catch (err) {
        return res.send({ data: "Please Try in another time" });
    }
}

exports.deals = async (req, res) => {
    try {
        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await MerchantModel.find({ promotion: { $ne: null } }).limit(10).skip(_skip).orFail((err) => Error(err));
        if (!dealsData)
            return res.status(405).send("Please enter data");
        res.send(dealsData);
    } catch (err) {
        return res.send(err);
    }
}

exports.request = async (req, res) => {
    try {
        if (!req.body.id)
            res.status(405).send("please enter valid data");

        let _merchant = await MerchantModel.findById({ _id: req.body.id }).populate('userId');
        if (!_merchant)
            return res.status(405).send("Please enter valid merchant data");
        if (!_merchant.promotion)
            res.status(405).send("Merchant doe not have any pormotion");

        let _checkDeal = await DealModel.findOne({ userId: req.userData._id, merchantId: _merchant._id });
        if (_checkDeal && _checkDeal.status == 'pending')
            return res.send({ deal: _checkDeal, requested: "you can not request deal multible time" });

        let dealObj = {};
        dealObj.title = _merchant.promotion.title;
        dealObj.description = _merchant.promotion.description;
        dealObj.type = _merchant.promotion.type;
        dealObj.amount = _merchant.promotion.amount;
        dealObj.price = _merchant.promotion.price;
        dealObj.usersType = _merchant.promotion.usersType;
        dealObj.subscriptionFees = _merchant.promotion.subscriptionFees;
        dealObj.sharePercentage = _merchant.promotion.sharePercentage;

        dealObj.creationDate = new Date();
        dealObj.merchantId = _merchant._id;
        dealObj.userId = req.userData._id;

        let _a = String(Math.floor(Math.random() * 10));
        let _b = String(Math.floor(Math.random() * 10));
        let _c = String(Math.floor(Math.random() * 10));
        let _d = String(Math.floor(Math.random() * 10));
        let verificationCode = _a + _b + _c + _d;

        dealObj.verificationCode = verificationCode;
        dealObj.comment = req.body.comment || null;
        dealObj.status = "pending";

        let _deal = await DealModel.create(dealObj);
        if (_.isNil(_deal))
            return res.status(405).send("error Happened");

        // console.log('socketid ' + _merchant.userId.socketId);
        let _socketObj = {};
        _socketObj.title = req.userData.firstName + ' ' + req.userData.lastName + 'New Deal Request';
        _socketObj.data = _deal;
        req.io.to(_merchant.userId.socketId).emit('newMessage', _socketObj);
        // req.io.emit('newMessage', req.userData.firstName + ' ' + req.userData.lastName + 'New Deal Request');

        return res.send(_deal);
    } catch (err) {
        return res.send({ data: err });
    }
}

exports.DealByMerchantById = async (req, res) => {
    try {
        console.log(req.query.id);
        let _merchants = await MerchantModel.findById({ _id: req.query.id });
        if (!_merchants)
            return res.status(405).send("Please enter valid merchant data");
        return res.send(_merchants);
    } catch (err) {
        return res.send(err.message);
    }
};


exports.DealData = async (req, res) => {
    try {
        if (!req.body.id)
            res.status(405).send("please enter valid data");

        let _merchant = await MerchantModel.findById({ _id: req.body.id });
        if (!_merchant)
            return res.status(405).send("Please enter valid merchant data");
        if (!_merchant.promotion)
            res.status(405).send("Merchant doe not have any pormotion");

        let _checkDeal = await DealModel.findOne({ userId: req.userData._id, merchantId: _merchant._id, status: "pending" });
        if (_checkDeal)
            return res.send(_checkDeal);
        return res.send({});
    } catch (err) {
        return res.send("Error Happened");
    }
}

exports.DealRequests = async (req, res) => {
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
        return res.send([]);
    } catch (err) {
        return res.send("Error Happened");
    }
}

exports.cancel = async (req, res) => {
    try {
        if (!req.body.id)
            res.status(405).send("please enter valid data");

        let _merchant = await MerchantModel.findById({ _id: req.body.id }).populate('userId');;
        if (!_merchant)
            return res.status(405).send("Please enter valid merchant data");

        let _checkDeal = await DealModel.findOne({ userId: req.userData._id, merchantId: _merchant._id });
        if (_.isNil(_checkDeal))
            return res.status(405).send("You can not cancel this request at this time");

        if (_checkDeal.status != "pending")
            return res.status(405).send("This Deal already " + _checkDeal.status + " you can not cancel.");

        await DealModel.remove({ userId: req.userData._id, merchantId: _merchant._id });


        let _socketObj = {};
        _socketObj.title = req.userData.firstName + ' ' + req.userData.lastName + 'cancel Deal';
        _socketObj.data = 'canceled';
        console.log("here is canceled");
        console.log(_merchant.userId.socketId);
        req.io.to(_merchant.userId.socketId).emit('newMessage', _socketObj);

        return res.send({ data: "Deal Canceled Successfully." })
    } catch (err) {
        return res.send("Error Happened");
    }
}


exports.cancel = async (req, res) => {
    try {
        if (!req.body.id)
            res.status(405).send("please enter valid data");

        let _merchant = await MerchantModel.findById({ _id: req.body.id }).populate('userId');;
        if (!_merchant)
            return res.status(405).send("Please enter valid merchant data");

        let _checkDeal = await DealModel.findOne({ userId: req.userData._id, merchantId: _merchant._id });
        if (_.isNil(_checkDeal))
            return res.status(405).send("You can not cancel this request at this time");

        if (_checkDeal.status != "pending")
            return res.status(405).send("This Deal already " + _checkDeal.status + " you can not cancel.");

        await DealModel.remove({ userId: req.userData._id, merchantId: _merchant._id });


        let _socketObj = {};
        _socketObj.title = req.userData.firstName + ' ' + req.userData.lastName + 'cancel Deal';
        _socketObj.data = 'canceled';
        console.log("here is canceled");
        console.log(_merchant.userId.socketId);
        req.io.to(_merchant.userId.socketId).emit('newMessage', _socketObj);

        return res.send({ data: "Deal Canceled Successfully." })
    } catch (err) {
        return res.send("Error Happened");
    }
}

exports.accept = async (req, res) => {
    try {
        if (!req.body.id)
            res.status(405).send("please enter valid data");

        let _merchant = await MerchantModel.findById({ _id: req.body.id }).populate('userId');;
        if (!_merchant)
            return res.status(405).send("Please enter valid merchant data");

        let _checkDeal = await DealModel.findOne({ userId: req.userData._id, merchantId: _merchant._id });
        if (_.isNil(_checkDeal))
            return res.status(405).send("You can not cancel this request at this time");

        if (_checkDeal.status != "pending")
            return res.status(405).send("This Deal already " + _checkDeal.status + " you can not cancel.");

        if (_checkDeal.verificationCode != req.body.code)
            return res.status(405).send("Code that you entered is not valid.");

        const updatedDeal = await DealModel.findOneAndUpdate({ _id: req.body.id, merchantId: req.merchantData.id },
            { $set: { status: 'accept' } }, { new: true });
        if (_.isNil(updatedDeal) || updatedDeal.length < 1)
            return res.status(405).send("Please enter data");


        let _socketObj = {};
        _socketObj.title = req.userData.firstName + ' ' + req.userData.lastName + 'cancel Deal';
        _socketObj.data = 'accept';
        console.log("here is accept");
        console.log(_merchant.userId.socketId);
        req.io.to(_merchant.userId.socketId).emit('newMessage', _socketObj);

        return res.send({ data: "Deal accepted Successfully." })
    } catch (err) {
        return res.send("Error Happened");
    }
}

exports.decline = async (req, res) => {
    try {
        if (_.isNil(req.body.id))
            return res.status(405).send("please enter valid data");

        const updatedDeal = await DealModel.findOneAndUpdate({ _id: req.body.id, merchantId: req.merchantData.id },
            { $set: { status: 'decline' } }, { new: true });
        if (_.isNil(updatedDeal) || updatedDeal.length < 1)
            return res.status(405).send("Please enter data");

        return res.send({ data: "Deal updated Successfully." })
    } catch (err) {
        return res.send("Error Happened");
    }
}




exports.history = async (req, res) => {
    try {
        let _checkDeal = await DealModel.find({ userId: req.userData._id }).populate('merchants');
        if (_checkDeal)
            return res.send(_checkDeal);
        return res.send({});
    } catch (err) {
        return res.send("Error Happened");
    }
}