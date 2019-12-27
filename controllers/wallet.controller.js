const merchant = require('../models/merchant.model');
const CategoryModel = require('../models/categories.model');
const TransactionModel = require('../models/transaction.model');
const countryModel = require('../models/country.model');
const packageModel = require('../models/package.model');
const UserModel = require('../models/user.model');
const DealModel = require('../models/deal.model');
const VerificationModel = require('../models/verification.model');
const passwordService = require('../services/passwordService');
const sendSmsService = require('../services/sendSmsService');
const tokenService = require('../services/tokenService');
const TransactionService = require('../services/transactionService');
const AirportModel = require('../models/airport.model');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

exports.balance = async(req, res) => {
    try {
        let data = {};
        data.availableBalance = 0;
        data.virtualBalance = 0;
        data.currentBalance = 0;

        data.currency = await countryModel.findOne({ enName: req.merchantData.country }, '-_id currency');
        if (!data.currency)
            return res.status(405).send("Error Happened please try again later.");

        let transactions = await TransactionModel.find({ status: "approved", $or: [{ from_userId: req.userData._id }, { to_userId: req.userData._id }] })
        if (!transactions)
            return res.status(405).send("Error Happened please try again later.");

        for (let x = 0; x < transactions.length; x++) {
            if (transactions[x].paymentMethod == "virtual") {

                console.log(String(req.userData._id));
                console.log(String(transactions[x].to_userId));

                if (String(transactions[x].to_userId) == String(req.userData._id)) {
                    data.virtualBalance = data.virtualBalance + transactions[x].amount;

                } else if (String(transactions[x].from_userId) == String(req.userData._id)) {
                    data.virtualBalance = data.virtualBalance - transactions[x].amount;
                }

            } else if (transactions[x].paymentMethod != "virtual") {
                if (String(transactions[x].from_userId) == String(req.userData._id)) {
                    data.availableBalance = data.availableBalance + transactions[x].amount;
                } else if (String(transactions[x].to_userId) == String(req.userData._id)) {
                    data.availableBalance = data.availableBalance - transactions[x].amount;
                }
            }
        }
        data.currency = data.currency.currency;
        data.availableBalance = parseInt(data.availableBalance);
        data.virtualBalance = parseInt(data.virtualBalance);
        data.currentBalance = data.availableBalance + data.virtualBalance;
        res.send(data);
    } catch (err) {
        return res.send(err.message);
    }
};

exports.adminMerchantBalance = async(req, res) => {
    try {
        let data = {};
        data.availableBalance = 0;
        data.virtualBalance = 0;
        data.currentBalance = 0;

        let _merchant = await merchant.findById({ _id: req.body.merchantId });
        if (!_merchant)
            return res.status(405).send("Please enter valid merchant data");

        data.currency = await countryModel.findOne({ enName: _merchant.country }, '-_id currency');
        if (!data.currency)
            return res.status(405).send("Error Happened please try again later.");

        let transactions = await TransactionModel.find({ status: "approved", $or: [{ from_userId: _merchant.userId }, { to_userId: _merchant.userId }] })
        if (!transactions)
            return res.status(405).send("Error Happened please try again later.");

        for (let x = 0; x < transactions.length; x++) {
            if (transactions[x].paymentMethod == "virtual") {

                if (String(transactions[x].to_userId) == String(_merchant.userId)) {
                    data.virtualBalance = data.virtualBalance + transactions[x].amount;

                } else if (String(transactions[x].from_userId) == String(_merchant.userId)) {
                    data.virtualBalance = data.virtualBalance - transactions[x].amount;
                }

            } else if (transactions[x].paymentMethod != "virtual") {
                if (String(transactions[x].from_userId) == String(_merchant.userId)) {
                    data.availableBalance = data.availableBalance + transactions[x].amount;
                } else if (String(transactions[x].to_userId) == String(_merchant.userId)) {
                    data.availableBalance = data.availableBalance - transactions[x].amount;
                }
            }
        }
        data.currency = data.currency.currency;
        data.availableBalance = parseInt(data.availableBalance);
        data.virtualBalance = parseInt(data.virtualBalance);
        data.currentBalance = data.availableBalance + data.virtualBalance;
        res.send(data);
    } catch (err) {
        return res.send(err.message);
    }
}

exports.userBalance = async(req, res) => {
    try {
        let data = {};
        data.availableBalance = 0;
        data.virtualBalance = 0;
        data.currentBalance = 0;

        data.currency = await countryModel.findOne({ enName: req.userData.country }, '-_id currency');
        if (!data.currency)
            return res.status(405).send("Error Happened please try again later.");

        let transactions = await TransactionModel.find({ status: "approved", $or: [{ from_userId: req.userData._id }, { to_userId: req.userData._id }] })
        if (!transactions)
            return res.status(405).send("Error Happened please try again later.");

        for (let x = 0; x < transactions.length; x++) {
            if (transactions[x].paymentMethod == "virtual") {

                console.log(String(req.userData._id));
                console.log(String(transactions[x].to_userId));

                if (String(transactions[x].to_userId) == String(req.userData._id)) {
                    data.virtualBalance = data.virtualBalance + transactions[x].amount;

                } else if (String(transactions[x].from_userId) == String(req.userData._id)) {
                    data.virtualBalance = data.virtualBalance - transactions[x].amount;
                }

            } else if (transactions[x].paymentMethod != "virtual") {
                if (String(transactions[x].from_userId) == String(req.userData._id)) {
                    data.availableBalance = data.availableBalance + transactions[x].amount;
                } else if (String(transactions[x].to_userId) == String(req.userData._id)) {
                    data.availableBalance = data.availableBalance - transactions[x].amount;
                }
            }
        }
        data.currency = data.currency.currency;
        data.availableBalance = parseInt(data.availableBalance);
        data.virtualBalance = parseInt(data.virtualBalance);
        data.currentBalance = data.availableBalance + data.virtualBalance;
        res.send(data);
    } catch (err) {
        return res.send(err.message);
    }
};

exports.hiddenHolidayBalance = async(req, res) => {
    try {
        let data = {};
        data.availableBalance = 0;
        data.virtualBalance = 0;
        data.currentBalance = 0;

        let _mainUser = await UserModel.findOne({ role: 'superAdmin' });
        if (!_mainUser)
            return res.status(405).send("Error Happened please try again later.");
        req.userData = _mainUser;

        let _country = await countryModel.findOne({ enName: req.userData.country });
        if (!_country)
            return res.status(405).send("Error Happened please try again later.");

        data.currency = _country.currency;
        data.exRate = _country.exRate;

        let _countries = await countryModel.find({});
        if (!_countries)
            return res.status(405).send("Error Happened please try again later.");



        let transactions = await TransactionModel.find({ status: "approved", $or: [{ from_userId: req.userData._id }, { to_userId: req.userData._id }] })
        if (!transactions)
            return res.status(405).send("Error Happened please try again later.");

        console.log(transactions.length);
        for (let x = 0; x < transactions.length; x++) {
            if (data.currency != transactions[x].currency) {

                for (let tc = 0; tc < _countries.length; tc++) {
                    let newAmount = 0;
                    if (transactions[x].currency == _countries[tc].currency) {
                        console.log("old amount " + transactions[x].amount);
                        console.log("exrate" + _countries[tc].exRate);
                        newAmount = transactions[x].amount / _countries[tc].exRate;
                        transactions[x].amount = newAmount / data.exRate;
                        console.log("new amount " + transactions[x].amount);
                    }
                }
            }

            if (transactions[x].paymentMethod == "virtual") {

                if (String(transactions[x].to_userId) == String(req.userData._id)) {
                    data.virtualBalance = data.virtualBalance + transactions[x].amount;

                } else if (String(transactions[x].from_userId) == String(req.userData._id)) {
                    data.virtualBalance = data.virtualBalance - transactions[x].amount;
                }

            } else if (transactions[x].paymentMethod != "virtual") {
                if (String(transactions[x].from_userId) == String(req.userData._id)) {
                    data.availableBalance = data.availableBalance + transactions[x].amount;
                } else if (String(transactions[x].to_userId) == String(req.userData._id)) {
                    data.availableBalance = data.availableBalance - transactions[x].amount;
                }
            }
        }

        console.log("-------------------------");
        // data.currency = data.currency.currency;
        data.availableBalance = parseInt(data.availableBalance);
        data.virtualBalance = parseInt(data.virtualBalance);
        data.currentBalance = data.availableBalance + data.virtualBalance;
        return res.send(data);
    } catch (err) {
        return res.send(err.message);
    }
};

exports.userAddFund = async(req, res) => {
    try {
        let transactionData = {};
        const transactionTo = await UserModel.findOne({ role: "superAdmin" });
        if (!transactionTo._id)
            return res.send("Error Happened try in another time");

        let countryData = await countryModel.findOne({ enName: req.userData.country });
        if (!countryData._id)
            return res.send("error Happened to find countryData");

        transactionData.from_userId = req.userData._id;
        transactionData.to_userId = transactionTo._id;
        transactionData.amount = req.body.amount;
        transactionData.currency = countryData.currency;

        transactionData.status = "approved";
        transactionData.sourceType = "Init";
        transactionData.comment = req.body.comment;
        transactionData.paymentMethod = "credit";
        transactionData.code = makeUserCode(10);
        transactionData.creationDate = new Date();

        let transactionResult = await TransactionService.createTransaction(transactionData);
        if (transactionResult == false)
            return res.status(401).send("error Happened while create transaction");
        return res.send(transactionResult);
    } catch (err) {
        console.log(err);
        return res.res.status(401).send("error Happened while create transaction");
    }
}


exports.merchantAddFund = async(req, res) => {
    try {
        let transactionData = {};
        const transactionTo = await UserModel.findOne({ role: "superAdmin" });
        if (!transactionTo._id)
            return res.send("Error Happened try in another time");

        let countryData = await countryModel.findOne({ enName: req.merchantData.country });
        if (!countryData._id)
            return res.send("error Happened to find countryData");

        transactionData.from_userId = req.userData._id;
        transactionData.to_userId = transactionTo._id;
        transactionData.amount = req.body.amount;
        transactionData.currency = countryData.currency;

        transactionData.status = "approved";
        transactionData.sourceType = "Init";
        transactionData.comment = "This is free init balance.";
        transactionData.paymentMethod = "credit";
        transactionData.code = makeUserCode(10);
        transactionData.creationDate = new Date();

        let transactionResult = await TransactionService.createTransaction(transactionData);
        if (transactionResult == false)
            return res.status(401).send("error Happened while create transaction");
        return res.send(transactionResult);
    } catch (err) {
        console.log(err);
        return res.res.status(401).send("error Happened while create transaction");
    }
}

function makeUserCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}