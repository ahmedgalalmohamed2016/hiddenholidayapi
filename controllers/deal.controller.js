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
        deal._id = "5d5737feac9c1a5e17a081d5";
        // deal.promotion_title =  r_title[Math.floor(Math.random() * r_title.length)];
        deal.promotion_title = "Get 50% discount in first hour";
        deal.promotion_description = "Get 50% discount in first hour when you visitFreeway Dance Studios. we are a team of dance professionals united to create an educational and enriching dance experience unique to Jordan. ";
        deal.promotion_type = "percentage";
        deal.promotion_amount = "50";
        deal.promotion_start_date = new Date();
        deal.promotion_end_date = deal.promotion_start_date.setMonth(deal.promotion_start_date.getMonth() + 2);

        deal.promotion_for = "individuals";
        deal.promotion_subscription_fees = 50;
        deal.promotion_share_percentage = 10;
        delete deal._id;

        const updatedUser = await MerchantModel.updateOne({ _id: deal._id },
            { $set: deal });
        if (_.isNil(updatedUser) || updatedUser.length < 1)
            return res.status(405).send("Please enter valid username / password");

    } catch (err) {
        return res.send({ data: "error" });
    }
}

exports.deals = async (req, res) => {
    try {
        // get deals
    } catch (err) {
        return res.send({ data: "error" });
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