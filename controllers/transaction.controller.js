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
        let transactions = await TransactionModel.find().populate('from_userId').populate('to_userId');
        if (_.isNil(transactions))
            return res.send("No Transaction found in our system");
        return res.send(transactions);

    } catch (err) {
        console.log(err);
        return res.send("Try in another time.");
    }
}

exports.me = async(req, res) => {
    try {
        let transactions = await TransactionModel.find({
            $or: [{ from_userId: req.userData._id }, { to_userId: req.userData._id }, ]
        }).populate('from_userId').populate('to_userId').sort('-creationDate');
        if (_.isNil(transactions))
            return res.status(405).send("No Transaction found in our system");
        return res.send(transactions);

    } catch (err) {
        console.log(err);
        return res.send("Try in another time.");
    }
}

exports.merchantById = async(req, res) => {
    try {
        if (!req.body.id)
            return res.status(405).send("Please choose valid merchant");

        let transactions = await TransactionModel.find({
            $or: [{ from_userId: req.body.id }, { to_userId: req.body.id }, ]
        }).populate('from_userId').populate('to_userId').sort('-creationDate');
        if (_.isNil(transactions))
            return res.send("No Transaction found for this merchant in our system");
        return res.send(transactions);

    } catch (err) {
        console.log(err);
        return res.send("Try in another time.");
    }
}
exports.hiddenHoliday = async(req, res) => {
    try {

        let _mainUser = await UserModel.findOne({ role: 'superAdmin' });
        if (!_mainUser)
            return res.status(405).send("Error Happened please try again later.");

        let transactions = await TransactionModel.find({
                $or: [{ from_userId: _mainUser._id }, { to_userId: _mainUser._id }, ]
            })
            .populate('from_userId').populate('to_userId').sort('-creationDate');
        if (_.isNil(transactions))
            return res.send("No Transaction found in our system");
        return res.send(transactions);

    } catch (err) {
        console.log(err);
        return res.send("Try in another time.");
    }
}

exports.getByAdmin = async(req, res) => {
    try {
        let transactions = await TransactionModel.find({
            $or: [{ from_userId: req.body.merchantId }, { to_userId: req.body.merchantId }, ]
        }).populate('from_userId').populate('to_userId');
        console.log(transactions);
        if (_.isNil(transactions))
            return res.send("No Transaction found in our system");
        return res.send(transactions);

    } catch (err) {
        console.log(err);
        return res.send("Try in another time.");
    }
}

exports.balance = async(req, res) => {
    try {
        let transactions = await TransactionModel.find({
            $or: [{ from_userId: req.userData._id }, { to_userId: req.userData._id }, ]
        }).populate('from_userId').populate('to_userId');
        if (_.isNil(transactions))
            return res.send("No Transaction found in our system");
        // let balance = 0;
        // for (let x = 0; x < transactions.length; x++) {
        //     if (transactions[x].)
        // }

        return res.send(transactions);

    } catch (err) {
        console.log(err);
        return res.send("Try in another time.");
    }
}