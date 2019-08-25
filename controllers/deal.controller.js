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
        // request deal id
        // get deal from merchant 
        // create deal in db
        // send notification
    } catch (err) {
        return res.send({ data: "error" });
    }
}

exports.update = async (req, res) => {
    try {

    } catch (err) {
        return res.send({ data: "error" });
    }
}

exports.history = async (req, res) => {
    try {

    } catch (err) {
        return res.send({ data: "error" });
    }
}