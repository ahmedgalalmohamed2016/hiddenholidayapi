const merchant = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const CountryModel = require('../models/country.model');
const CategoryModel = require('../models/categories.model');

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

exports.adminCreateMerchantAdmin = async(req, res) => {
    try {
        if (!req.body.mobileNumber || !req.body.password || !req.body.country || !req.body.firstName || !req.body.lastName)
            return res.send('Please enter required fields.');
        const _country = await CountryModel.findOne({ enName: req.body.country });

        if (_.isNil(_country))
            return res.status(405).send("Please enter valid country");

        let saveData = {};
        saveData._id = new mongoose.Types.ObjectId;
        saveData.userDevice = uuidv4();
        const userDevice = saveData.userDevice;
        const usersNamedFinn = await UserModel.find({ mobileNumber: req.body.mobileNumber });

        if (usersNamedFinn.length > 0 && req.body.mobileNumber == usersNamedFinn[0].mobileNumber)
            return res.status(405).send("mobile number is not available try another one");

        const password = await passwordService.generatePassword(req.body.password, saveData._id);
        if (_.isNil(password) || password == false)
            return res.status(405).send("error Happened");

        // Generate Token
        const token = await tokenService.generateLoginToken(saveData.userDevice, saveData._id, req.body.mobileNumber, 'merchantAdmin');
        if (_.isNil(token) || token == false)
            return res.status(405).send("error Happened");

        saveData.password = password;
        saveData.role = 'merchantAdmin';

        saveData.mobileNumber = req.body.mobileNumber;
        saveData.country = req.body.country;
        saveData.lastLoginDate = new Date();
        saveData.userNumber = makeUserCode(10);
        saveData.userToken = token;
        saveData.verifiedMobileNumber = true;
        saveData.firstName = req.body.firstName;
        saveData.lastName = req.body.lastName;

        const user = await UserModel.create(saveData);
        if (_.isNil(user))
            return res.status(405).send("error Happened while create new user.");

        return res.send(user);
    } catch (err) {
        return res.status(405).send({ data: err || "error" });
    }
}


exports.adminMerchantsGetMerchants = async(req, res) => {
    try {
        if (!req.body.id)
            return res.status(405).send("Please enter valid merchant id");
        let _merchants = await merchant.find({ userId: req.body.id }).populate('categoryId');
        if (!_merchants)
            return res.status(405).send("Please enter valid merchant data");
        return res.send(_merchants);
    } catch (err) {
        return res.send(err.message);
    }
};

exports.adminGetMerchantAdmins = async(req, res) => {
    try {
        let _skip = 0;
        let _query = {};
        if (!req.body.name)
            req.body.name = '';
        if (req.body.gender)
            _query.gender = req.body.gender;

        if (req.body.skip)
            _skip = req.body.skip * 50;

        let _users = await UserModel.find({
            $or: [
                { firstName: { $regex: req.body.name, $options: "i" } },
                { lastName: { $regex: req.body.name, $options: "i" } },
                { country: { $regex: req.body.name, $options: "i" } },
                { mobileNumber: { $regex: req.body.name, $options: "i" } }
            ],
            role: 'merchantAdmin'
        }, '-password -userToken').limit(50).skip(_skip).sort('-lastLoginDate');
        return res.send(_users);
    } catch (err) {
        return res.status(405).send(err);
    }
}

exports.adminChangePassword = async(req, res) => {
    try {
        if (!req.body.id || !req.body.password)
            return res.status(405).send('Please enter required fields.');

        const _user = await UserModel.findOne({ _id: req.body.id, role: 'merchantAdmin' });
        if (!_user)
            return res.status(405).send("No user found with this data");

        // Generate Password
        const password = await passwordService.generatePassword(req.body.password, _user._id);
        if (_.isNil(password) || password == false)
            return res.status(405).send("error Happened while generate new password");

        const updatedUser = await UserModel.findOneAndUpdate({ _id: req.body.id, }, { $set: { password: password } }, { new: true })
        if (!updatedUser)
            return res.status(405).send("No user found with this data");
        return res.send({ message: "Password Updated Successfully." });
    } catch (err) {
        return res.status(405).send("Error happened while update user data");
    }
}

exports.adminGetUserById = async(req, res) => {
    try {
        if (!req.body.id)
            return res.status(405).send("No user valid with this data");
        let _user = await UserModel.findOne({ _id: req.body.id, role: 'merchantAdmin' }, '-password -userToken');
        return res.send(_user);
    } catch (err) {
        return res.status(405).send(err);
    }
}

exports.adminUpdateUser = async(req, res) => {
    try {
        if (!req.body.id)
            return res.status(405).send("No user valid with this data");

        if (!req.body.id || !req.body.isLockedOut || !req.body.mobileNumber || !req.body.country || !req.body.firstName || !req.body.lastName)
            return res.send('Please enter required fields.');

        let data = {};
        data.firstName = req.body.firstName;
        data.lastName = req.body.lastName;
        data.email = req.body.email;
        data.mobileNumber = req.body.mobileNumber;
        data.country = req.body.country;
        data.isLockedOut = req.body.isLockedOut;
        data.firstName = req.body.firstName;
        data.lastName = req.body.lastName;

        let _user = await UserModel.findOne({ _id: req.body.id });
        if (!_user)
            return res.status(405).send("No bid found with this data");

        let _mobile = await UserModel.findOne({ mobileNumber: req.body.mobileNumber });

        if (_mobile && String(_mobile._id) != String(_user._id))
            return res.status(405).send("this mobile number already registered for another user before .");

        let _res = await UserModel.findOneAndUpdate({ _id: req.body.id }, { $set: data }, { new: true });
        if (!_res)
            return res.status(405).send("Can not update this user,try in another time.");
        return res.send(_res);
    } catch (err) {
        return res.send("Error Happened");
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