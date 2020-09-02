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
                return res.status(404).send({ statusCode: 404, message:"Please enter valid data"});

            let _user = await UserModel.findOne({ mobileNumber: req.body.user });
            if (_.isNil(_user))
                return res.status(401).send({ statusCode: 401, message:"no user found for this data."});

            // let _merchants = await merchantModel.findById({ _id: req.body.merchant });
            let _merchants = await merchantModel.findOne({ clean_name: req.body.merchant });
            if (!_merchants)
                return res.status(404).send({ statusCode: 404, message:"Please enter valid merchant data"});

            const updatedUser = await UserModel.findByIdAndUpdate(_user._id, { merchant: _merchants._id, role: 'merchant' }).lean();
            if (_.isNil(updatedUser))
                return res.status(404).send({ statusCode: 404, message:"Error Happened ,contact our support."});

            return res.status(200).send({ statusCode: 200, message:"Success",data:updatedUser});
        } catch (err) {
            return res.status(404).send({ statusCode: 404, message:err.message});
        }
    },
    exports.merchantData = async(req, res) => {
        try {
            let _merchants = await merchantModel.findById({ _id: req.userData.merchant });
            if (!_merchants)
                return res.status(404).send({ statusCode: 404, message:"Please enter valid merchant data"});

            return res.status(200).send({ statusCode: 200, message:"Success",data:{ user: req.userData, merchant: _merchants }});
        } catch (err) {
            return res.status(404).send({ statusCode: 404, message:err.message});
        }
    },

    exports.deals = async(req, res) => {
        try {
            dealsData = await DealModel.find({ merchantId: req.userData.merchant }).
            populate('userId', 'mobileNumber _id firstName lastName email')
                .orFail((err) => Error(err));
            if (!dealsData)
                return res.status(404).send({ statusCode: 404, message:"No deals found"});
            return res.status(200).send({ statusCode: 200, message:"Success",data:dealsData});
        } catch (err) {
            return res.status(404).send({ statusCode: 404, message:err.message});
        }
    }

exports.updateRequest = async(req, res) => {
    try {
        if (!req.body.status || !req.body.deal || !req.body.code)
            return res.status(404).send({ statusCode: 404, message:"please enter valid deal data"});
        if (['approved', 'rejected'].indexOf(req.body.status) < 0)
            return res.status(404).send({ statusCode: 404, message:"please enter valid deal status"});

        let dealsData = await DealModel.findOne({ merchantId: req.userData.merchant, _id: req.body.deal })
        if (!dealsData)
            return res.status(404).send({ statusCode: 404, message:"No deals found with this data"});

        if (dealsData.verificationCode != req.body.code)
            return res.status(404).send({ statusCode: 404, message:"please enter valid code for this deal"});

        if (dealsData.status != 'pending')
            return res.status(404).send({ statusCode: 404, message:"This deal already " + dealsData.status + " before"});

        const updatedDeal = await DealModel.findByIdAndUpdate(dealsData._id, { status: req.body.status }).lean();
        if (_.isNil(updatedDeal))
            return res.status(404).send({ statusCode: 404, message:"Error Happened ,contact our support."});

        return res.status(200).send({ statusCode: 200, message:"this deal is " + req.body.status + " success."});
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err});
    }
}