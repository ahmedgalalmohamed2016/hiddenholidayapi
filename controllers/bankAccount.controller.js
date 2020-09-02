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
            return res.status(404).send({ statusCode: 404,message:"error Happened to find countryData"});

        data.country = countryData.enName;

        let bankData = await BankAcountModel.create(data);
        if (_.isNil(bankData))
            return res.status(401).send({ statusCode: 401,message:"Can not add bank account."});
        return res.status(200).send({ statusCode: 200,message:"Success",data:bankData});

    } catch (err) {
        return res.status(401).send({ statusCode: 401,message:"Can not add bank account."});
    }
}

exports.merchantList = async(req, res) => {
    try {
        let bankData = await BankAcountModel.find({ merchantId: req.merchantData._id, isDeleted: false });
        if (!bankData)
            return res.status(405).send({ statusCode: 405,message:"We don't found any accounts"});
        return res.status(200).send({ statusCode: 200,message:"success",data:bankData});
    } catch (err) {
        return res.status(405).send({ statusCode: 405,message:"Can not find bank accounts."});
    }
}

exports.details = async(req, res) => {
    try {

        if (!req.body.id)
            return res.status(405).send({ statusCode: 405,message:"Can not find bank accounts."});

        let bankAccount = await BankAcountModel.findOne({ _id: req.body.id, isDeleted: false });
        if (_.isNil(bankAccount))
            return res.status(404).send({ statusCode: 404,message:"No Accounts found in our system"});
        return res.status(200).send({ statusCode: 200,message:"Success",data:bankAccount});

    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Try in another time."});
    }
}

exports.delete = async(req, res) => {
    try {
        if (_.isNil(req.body.id))
            return res.status(405).send({ statusCode: 405,message:"Bank id is required."});

        let bankAccount = await BankAcountModel.updateOne({ _id: req.body.id, merchantId: req.merchantData._id }, { $set: { isDeleted: true } }, { new: true });

        if (_.isNil(bankAccount))
            return res.status(405).send({ statusCode: 405,message:"Cannot remove this bank account."});
        return res.status(200).send({ statusCode: 200,message:"Success",data:bankAccount});
    } catch (err) {
        return res.status(405).send({ statusCode: 405,message:"Cannot remove this bank account,Try in another time."});
    }
}

exports.allBanckAcounts = async(req, res) => {
    let filter = {}
    try {
        if(req.body.merchantId)
        filter.merchantId = req.body.merchantId;

        if(req.body.bankAccountId)
        filter._id = req.body.merchantId;

        filter.page = req.body.page ? req.body.page : 0;
        filter.isDeleted = false;

        let _skip = filter.page * 10;
        const page = filter.page;
        delete filter.page;
        let bankData = await BankAcountModel.find(filter)
        .sort("-creationDate")
        .skip(_skip)
        .limit(10);
        if (!bankData)
            return res.status(405).send("We don't found any accounts");
        let bankCount = await BankAcountModel.count({isDeleted:false});
        return res.status(200).send({ statusCode: 200,message:"success",data:{
            count :bankCount,
            page:page,
            list:bankData
        }});
    } catch (err) {
        return res.status(405).send({ statusCode: 405,message:"Can not find bank accounts."});
    }
}