const MerchantModel = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const CountryModel = require('../models/country.model');
const BankAcountModel = require('../models/bankAccount.model');
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

exports.create = async(req, res) => {
    try {
        let data = req.body;
        data.creationDate = new Date();
        data.merchantId = req.merchantData._id;
        data.userId = req.userData._id;

        let countryData = await CountryModel.findOne({ _id: req.body.countryId });
        if (!countryData._id)
            return res.send("error Happened to find countryData");

        data.country = countryData.enName;

        let bankData = await BankAcountModel.create(data);
        if (_.isNil(bankData))
            return res.status(401).send("Can not add bank account.");
        return res.send(bankData);

    } catch (err) {
        return res.status(401).send("Can not add bank account.");
    }
}

exports.merchantList = async(req, res) => {
    try {
        let bankData = await BankAcountModel.find({ merchantId: req.merchantData._id });
        if (!bankData)
            return res.status(405).send("We don't found any accounts");
        return res.send(bankData);
    } catch (err) {
        return res.status(405).send("Can not find bank accounts.");
    }
}