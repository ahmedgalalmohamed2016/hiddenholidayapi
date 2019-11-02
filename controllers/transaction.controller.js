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
        }).populate('from_userId').populate('to_userId');
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