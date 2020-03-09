const MerchantModel = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const DealModel = require('../models/deal.model');
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

exports.Demodeals = async(req, res) => {
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

        const updatedUser = await MerchantModel.updateOne({ clean_name: "Jordan Bowling" }, { $set: { promotion: deal } }, { new: true });
        if (_.isNil(updatedUser) || updatedUser.length < 1)
            return res.status(405).send("Please enter data");
        return res.send(updatedUser);
    } catch (err) {
        return res.send({ data: "error" });
    }
}

exports.createDeal = async(req, res) => {
    try {
        let deal = {};
        deal.title = req.body.title;
        deal.description = req.body.description;
        //percentage fixed
        deal.type = req.body.type;
        deal.amount = req.body.amount;
        deal.price = req.body.price;

        deal.usersType = req.body.usersType; //"individual" "group";
        deal.subscriptionFees = "0";
        deal.sharePercentage = "0";

        if (req.merchantData.promotion)
            return res.status(402).send("You already have a deal contact support to modify it for you");

        const updatedMerchant = await MerchantModel.updateOne({ clean_name: req.merchantData.name }, { $set: { promotion: deal, isActivePromotion: true, isVerifiedPromotion: false } }, { new: true });
        if (_.isNil(updatedMerchant) || updatedMerchant.length < 1)
            return res.status(405).send("We can not add your deal now.try in another time.");
        return res.send(updatedMerchant);
    } catch (err) {
        return res.send({ data: "Please Try in another time" });
    }
}

exports.updateDeal = async(req, res) => {
    try {
        let deal = {};
        deal.title = req.body.title;
        deal.description = req.body.description;
        //percentage fixed
        deal.type = req.body.type;
        deal.amount = req.body.amount;
        deal.price = req.body.price;

        deal.usersType = req.body.usersType; //"individual" "group";
        deal.subscriptionFees = "0";
        deal.sharePercentage = "0";

        if (!req.merchantData.promotion)
            return res.status(402).send("You don't have any deal you add first one now.");

        const updatedMerchant = await MerchantModel.updateOne({ clean_name: req.merchantData.name }, { $set: { promotion: deal, isActivePromotion: true, isVerifiedPromotion: false } }, { new: true });
        if (_.isNil(updatedMerchant) || updatedMerchant.length < 1)
            return res.status(405).send("We can not update your deal.Try in another time.");
        return res.send(updatedMerchant);
    } catch (err) {
        return res.send({ data: "Please Try in another time" });
    }
}

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

exports.deals = async(req, res) => {
    try {

        if (!req.query.country)
            return res.status(405).send("Please enter valid country data");
        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await DealModel.find({ isArchived: false, country: req.query.country }).populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
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
            console.log("----------1---------" + req.body.ids[x]);
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
        let dealsData = await DealModel.find({ merchantId: req.body.merchantId }).populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
        if (!dealsData)
            return res.status(405).send("Please enter valid data");
        res.send(dealsData);
    } catch (err) {
        return res.send(err);
    }
}

exports.request = async(req, res) => {
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

        let _socketObj = {};
        _socketObj.title = req.userData.firstName + ' ' + req.userData.lastName + 'New Deal Request';
        _socketObj.data = _deal;
        // req.io.to(_merchant.userId.socketId).emit('newMessage', _socketObj);
        // req.io.emit('newMessage', req.userData.firstName + ' ' + req.userData.lastName + 'New Deal Request');

        return res.send(_deal);
    } catch (err) {
        return res.send({ data: err });
    }
}

exports.DealByMerchantById = async(req, res) => {
    try {
        let _merchants = await MerchantModel.findById({ _id: req.query.id }).populate('categoryId');
        if (!_merchants)
            return res.status(405).send("Please enter valid merchant data");
        return res.send(_merchants);
    } catch (err) {
        return res.send(err.message);
    }
};


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

exports.cancel = async(req, res) => {
    try {
        if (!req.body.id)
            res.status(405).send("please enter valid data");

        let _merchant = await MerchantModel.findById({ _id: req.body.id }).populate('userId');;
        if (!_merchant)
            return res.status(405).send("Please enter valid merchant data");

        let _checkDeal = await DealModel.findOne({ userId: req.userData._id, merchantId: _merchant._id, status: "pending" });
        if (_.isNil(_checkDeal))
            return res.status(405).send("You can not cancel this request at this time");

        if (_checkDeal.status != "pending")
            return res.status(405).send("This Deal already " + _checkDeal.status + " you can not cancel.");

        await DealModel.remove({ userId: req.userData._id, merchantId: _merchant._id });


        let _socketObj = {};
        _socketObj.title = req.userData.firstName + ' ' + req.userData.lastName + 'cancel Deal';
        _socketObj.data = 'canceled';

        // req.io.to(_merchant.userId.socketId).emit('newMessage', _socketObj);

        return res.send({ data: "Deal Canceled Successfully." })
    } catch (err) {
        return res.send("Error Happened");
    }
}



exports.accept = async(req, res) => {
    try {
        if (!req.body.id)
            res.status(405).send("please enter valid data");

        let _merchant = await MerchantModel.findById({ _id: req.body.id }).populate('userId');;
        if (!_merchant)
            return res.status(405).send("Please enter valid merchant data");

        let _checkDeal = await DealModel.findOne({ userId: req.userData._id, merchantId: _merchant._id, status: "pending" });
        if (_.isNil(_checkDeal))
            return res.status(405).send("You can not cancel this request at this time");

        if (_checkDeal.status != "pending")
            return res.status(405).send("This Deal already " + _checkDeal.status + " you can not cancel.");

        if (_checkDeal.verificationCode != req.body.code)
            return res.status(405).send("Code that you entered is not valid.");

        let updatedDeal = await DealModel.findOneAndUpdate({ _id: _checkDeal._id }, { $set: { status: 'accept' } }, { new: true });
        if (_.isNil(updatedDeal) || updatedDeal.length < 1)
            return res.status(405).send("Please enter data");


        let _socketObj = {};
        _socketObj.title = req.userData.firstName + ' ' + req.userData.lastName + 'accept Deal';
        _socketObj.data = 'accept';

        // req.io.to(_merchant.userId.socketId).emit('newMessage', _socketObj);

        return res.send({ data: "Deal accepted Successfully." })
    } catch (err) {
        return res.send("Error Happened");
    }
}

exports.decline = async(req, res) => {
    try {
        if (_.isNil(req.body.id))
            return res.status(405).send("please enter valid data");

        const updatedDeal = await DealModel.findOneAndUpdate({ _id: req.body.id, merchantId: req.merchantData.id }, { $set: { status: 'decline' } }, { new: true });
        if (_.isNil(updatedDeal) || updatedDeal.length < 1)
            return res.status(405).send("Please enter data");

        return res.send({ data: "Deal updated Successfully." })
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