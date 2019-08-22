const merchant = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const VerificationModel = require('../models/verification.model');
const passwordService = require('../services/passwordService');
const sendSmsService = require('../services/sendSmsService');
const tokenService = require('../services/tokenService');

const _ = require("lodash");
const request = require("superagent");
const fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
// const 

exports.register = async (req, res) => {
    try {

        if (!req.body.mobileNumber || !req.body.firstName || !req.body.lastName || !req.body.password)
            return res.send('Please enter required fields.');
        let saveData = {};
        saveData._id = new mongoose.Types.ObjectId;
        saveData.userDevice = uuidv4();
        const userDevice = saveData.userDevice;
        const usersNamedFinn = await UserModel.find({
            $or: [{ mobileNumber: req.body.mobileNumber }, { email: req.body.email }]
        });
        if (usersNamedFinn.length > 0 && req.body.mobileNumber == usersNamedFinn[0].mobileNumber)
            return res.send("mobile number is not available try another one");

        else if (usersNamedFinn.length > 0 && req.body.email == usersNamedFinn[0].email)
            return res.send("email is not available try another one");

        else if (usersNamedFinn.length > 0)
            return res.send("mobile number or email is duplicated");

        // Generate Password
        const password = await passwordService.generatePassword(req.body.password, saveData._id);
        if (_.isNil(password) || password == false)
            return res.send("error Happened");

        // Generate Token
        const token = await tokenService.generateLoginToken(saveData.userDevice, saveData._id, req.body.mobileNumber, 'user');
        if (_.isNil(token) || token == false)
            return res.send("error Happened");

        saveData.password = password;
        saveData.role = 'user';

        saveData.firstName = req.body.firstName;
        saveData.lastName = req.body.lastName;
        saveData.mobileNumber = req.body.mobileNumber;
        saveData.email = req.body.email;
        saveData.lastLoginDate = new Date();
        saveData.userNumber = Math.floor(Math.random() * 90000000) + 1000000;
        saveData.userToken = token;

        const user = await UserModel.create(saveData);
        if (_.isNil(user))
            return res.send("error Happened");

        // Verification Number
        let verificationData = {};
        verificationData.userId = saveData._id;
        //  verificationData.id = uuidv4();
        verificationData.userDevice = userDevice;
        verificationData.mobileNumber = req.body.mobileNumber;
        verificationData.verificationType = 'register';


        let _a = String(Math.floor(Math.random() * 10));
        let _b = String(Math.floor(Math.random() * 10));
        let _c = String(Math.floor(Math.random() * 10));
        let _d = String(Math.floor(Math.random() * 10));
        let verificationCode = _a + _b + _c + _d;

        verificationData.verificationCode = await passwordService.generatePassword(verificationCode, saveData.mobileNumber);
        verificationData.isVerified = false;
        let verfificationCreated = await VerificationModel.create(verificationData);
        if (_.isNil(verfificationCreated))
            return res.send("error Happened");
        await sendSmsService.sendActivationAccountsms(req, saveData.mobileNumber, verificationCode);
        user._verificationCode = verificationCode;
        console.log(verificationCode);
        return res.send(user);
    } catch (err) {
        return res.send({ data: "error" });
    }
}

exports.resendSms = async (req, res) => {
    try {


        const _getVerifications = await VerificationModel.find({
            mobileNumber: req.userData.mobileNumber,
            isVerified: false
        });
        if (_getVerifications && _getVerifications.length > 3)
            return res.status(401).send("Sms sent maximum exceeded.contact our support.");

        let verificationData = {};
        verificationData.userId = req.userData._id;
        //  verificationData.id = uuidv4();
        verificationData.userDevice = req.body.userDevice;
        verificationData.mobileNumber = req.userData.mobileNumber;
        verificationData.verificationType = 'register';


        let _a = String(Math.floor(Math.random() * 10));
        let _b = String(Math.floor(Math.random() * 10));
        let _c = String(Math.floor(Math.random() * 10));
        let _d = String(Math.floor(Math.random() * 10));
        let verificationCode = _a + _b + _c + _d;
        console.log(verificationCode);
        verificationData.verificationCode = await passwordService.generatePassword(verificationCode, req.userData.mobileNumber);
        verificationData.isVerified = false;
        let verfificationCreated = await VerificationModel.create(verificationData);
        if (_.isNil(verfificationCreated))
            return res.send("error Happened");
        sendSmsService.sendActivationAccountsms(req, req.userData.mobileNumber, verificationCode);
        return res.send("message send success to your mobile phone");
    } catch (err) {
        return res.send(err);
    }
}

exports.verifyPhone = async (req, res) => {
    try {

        if (req.userData.verifiedMobileNumber == true)
           return res.send("Your Phone number already verified before");

        if (!req.body.code || req.body.code.length != 4)
            return res.status(401).send("Please enter valid code");
        let _verificationCode = await passwordService.generatePassword(req.body.code, req.userData.mobileNumber);

        const _getVerification = await VerificationModel.findOne({
            mobileNumber: req.userData.mobileNumber,
            verificationCode: _verificationCode,
            isVerified: false
        }).lean();
        if (_.isNil(_getVerification))
            return res.status(401).send("Please Enter Valid Code.");

        const updatedVerify = await VerificationModel.findByIdAndUpdate(_getVerification._id, { isVerified: true }).lean();
        if (_.isNil(updatedVerify))
            return res.status(401).send("Error Happened ,contact our support.");

        // enc code
        //find with phone in verification
        // same data update verification
        // update user


        //req.userData
        const updatedUser = await UserModel.findByIdAndUpdate(req.userData._id, { verifiedMobileNumber: true }).lean();
        if (_.isNil(updatedUser))
            return res.status(401).send("Error Happened ,contact our support.");
        return res.send("Mobile Verified Successfull.");
    } catch (err) {
        return res.send(err);
    }
}

exports.getUserData = async (req, res) => {
    try {
        //console.log(req.userData);
        return res.send(req.userData);
    } catch (err) {
        return res.send(err);
    }
}

exports.login = async (req, res) => {
    try {
        const usersNamedFinn = await UserModel.find({
            $or: [{ mobileNumber: req.body.username }, { email: req.body.username }]
        });
        if (usersNamedFinn.length < 1)
            return res.status(405).send("Please enter valid username / password");

        const password = await passwordService.comparePassword(req.body.password, usersNamedFinn[0].password, usersNamedFinn[0]._id);
        if (_.isNil(password) || password != true)
            return res.status(405).send("Please enter valid username / password");

        // Generate Token
        let saveData = {};
        saveData.userDevice = uuidv4();

        // Generate Token
        const userToken = await tokenService.generateLoginToken(saveData.userDevice, usersNamedFinn[0]._id, usersNamedFinn[0].mobileNumber, usersNamedFinn[0].role);
        if (_.isNil(userToken) || userToken == false)
            return res.status(405).send("Please enter valid username / password");

        saveData.userToken = userToken;
        saveData.lastLoginDate = new Date();

        const updatedUser = await UserModel.updateOne({ _id: usersNamedFinn[0]._id },
            { $set: saveData });
        if (_.isNil(updatedUser) || updatedUser.length < 1)
            return res.status(405).send("Please enter valid username / password");

        let getUser = await UserModel.findOne({ _id: usersNamedFinn[0]._id }).lean();
        if (_.isNil(getUser))
            return res.status(405).send("Please enter valid username / password");
        return res.send(getUser);
    } catch (err) {
        return res.send(err);
    }
}

exports.logout = async (req, res) => {
    try {
        //req.userData
        const updatedUser = await UserModel.findByIdAndUpdate(req.userData._id, { userToken: null }).lean();
        if (_.isNil(updatedUser))
            return res.status(401).send("Error Happened ,contact our support.");
        return res.send("logout successful");
    } catch (err) {
        return res.send(err);
    }
}