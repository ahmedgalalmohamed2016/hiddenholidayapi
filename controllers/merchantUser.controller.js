const merchantModel = require('../models/merchant.model');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');
const UserModel = require('../models/user.model');
const DealModel = require('../models/deal.model');


exports.assign = async(req, res) => {
        try {
            if (!req.body.user || !req.body.merchant)
                return res.send("Please enter valid data");

            let _user = await UserModel.findOne({ mobileNumber: req.body.user });
            if (_.isNil(_user))
                return res.status(401).send("no user found for this data.");

            // let _merchants = await merchantModel.findById({ _id: req.body.merchant });
            let _merchants = await merchantModel.findOne({ clean_name: req.body.merchant });
            if (!_merchants)
                return res.status(405).send("Please enter valid merchant data");

            const updatedUser = await UserModel.findByIdAndUpdate(_user._id, { merchant: _merchants._id, role: 'merchant' }).lean();
            if (_.isNil(updatedUser))
                return res.status(401).send("Error Happened ,contact our support.");

            return res.send(updatedUser);
        } catch (err) {
            return res.send(err.message);
        }
    },
    exports.merchantData = async(req, res) => {
        try {
            let _merchants = await merchantModel.findById({ _id: req.userData.merchant });
            if (!_merchants)
                return res.status(405).send("Please enter valid merchant data");

            return res.send({ user: req.userData, merchant: _merchants });
        } catch (err) {
            return res.send(err.message);
        }
    },

    exports.deals = async(req, res) => {
        try {
            dealsData = await DealModel.find({ merchantId: req.userData.merchant }).
            populate('userId', 'mobileNumber _id firstName lastName email')
                .orFail((err) => Error(err));
            if (!dealsData)
                return res.status(405).send("No deals found");
            return res.send(dealsData);
        } catch (err) {
            return res.send(err.message);
        }
    }

exports.updateRequest = async(req, res) => {
    try {
        if (!req.body.status || !req.body.deal || !req.body.code)
            return res.send("please enter valid deal data");
        if (['approved', 'rejected'].indexOf(req.body.status) < 0)
            return res.send("please enter valid deal status");

        let dealsData = await DealModel.findOne({ merchantId: req.userData.merchant, _id: req.body.deal })
        if (!dealsData)
            return res.status(405).send("No deals found with this data");

        if (dealsData.verificationCode != req.body.code)
            return res.send("please enter valid code for this deal");

        if (dealsData.status != 'pending')
            return res.send("This deal already " + dealsData.status + " before");

        const updatedDeal = await DealModel.findByIdAndUpdate(dealsData._id, { status: req.body.status }).lean();
        if (_.isNil(updatedDeal))
            return res.status(401).send("Error Happened ,contact our support.");

        return res.send("this deal is " + req.body.status + " success.");
    } catch (err) {
        return res.send(err);
    }
}