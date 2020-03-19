const merchant = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const DealModel = require('../models/deal.model');
const TransactionModel = require('../models/transaction.model');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');

exports.getAll = async(req, res) => {
    try {
        let transactions = await TransactionModel.find().populate('fromUserId').populate('toUserId');
        if (_.isNil(transactions))
            return res.send("No Transaction found in our system");
        return res.send(transactions);

    } catch (err) {
        return res.send("Try in another time.");
    }
}

exports.me = async(req, res) => {
    try {
        let transactions = await TransactionModel.find({
            $or: [{ fromUserId: req.userData._id }, { toUserId: req.userData._id }, ]
        }).populate('fromUserId').populate('toUserId').sort('-creationDate').limit(10);
        if (_.isNil(transactions))
            return res.status(405).send("No Transaction found in our system");
        return res.send(transactions);

    } catch (err) {
        return res.send("Try in another time.");
    }
}

exports.merchantById = async(req, res) => {
    try {
        if (!req.body.id)
            return res.status(405).send("Please choose valid merchant");

        let _merchant = await merchant.findById({ _id: req.body.id });
        if (!_merchant)
            return res.status(405).send("Please enter valid merchant data");

        let _user = await UserModel.findOne({ merchant: req.body.id });
        if (!_user)
            return res.status(405).send("Please enter valid merchant data");

        let transactions = await TransactionModel.find({
            $or: [{ fromUserId: _user._id }, { toUserId: _user._id }, ]
        }).populate('fromUserId').populate('toUserId').sort('-creationDate');
        if (_.isNil(transactions))
            return res.send("No Transaction found for this merchant in our system");
        return res.send(transactions);

    } catch (err) {
        return res.send("Try in another time.");
    }
}
exports.hiddenHoliday = async(req, res) => {
    try {

        let _mainUser = await UserModel.findOne({ role: 'superAdmin' });
        if (!_mainUser)
            return res.status(405).send("Error Happened please try again later.");

        let transactions = await TransactionModel.find({
                $or: [{ fromUserId: _mainUser._id }, { toUserId: _mainUser._id }, ]
            })
            .populate('fromUserId').populate('toUserId').sort('-creationDate');
        if (_.isNil(transactions))
            return res.send("No Transaction found in our system");
        return res.send(transactions);

    } catch (err) {
        return res.send("Try in another time.");
    }
}

exports.getByAdmin = async(req, res) => {
    try {
        let transactions = await TransactionModel.find({
            $or: [{ fromUserId: req.body.merchantId }, { toUserId: req.body.merchantId }, ]
        }).populate('fromUserId').populate('toUserId');
        if (_.isNil(transactions))
            return res.send("No Transaction found in our system");
        return res.send(transactions);

    } catch (err) {
        return res.send("Try in another time.");
    }
}


exports.details = async(req, res) => {

    try {
        let transactions = await TransactionModel.findOne({ _id: req.body.id }).populate('fromUserId').populate('toUserId');
        if (_.isNil(transactions))
            return res.send("No Transaction found in our system");

        return res.send(transactions);

    } catch (err) {
        return res.send("Try in another time.");
    }
}


exports.balance = async(req, res) => {
    try {
        let transactions = await TransactionModel.find({
            $or: [{ fromUserId: req.userData._id }, { toUserId: req.userData._id }, ]
        }).populate('fromUserId').populate('toUserId');
        if (_.isNil(transactions))
            return res.send("No Transaction found in our system");


        return res.send(transactions);

    } catch (err) {
        return res.send("Try in another time.");
    }
}