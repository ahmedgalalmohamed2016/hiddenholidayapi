const merchant = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const Verifications = require('../models/verification.model');
const passwordService = require('../services/passwordService');
const sendSmsService = require('../services/sendSmsService');
const tokenService = require('../services/tokenService');

sendSmsService

const _ = require("lodash");
const request = require("superagent");
const fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
// const 

exports.register = async (req, res) => {
    try {
        let saveData = {};
        saveData._id = new mongoose.Types.ObjectId;
        saveData.userDevice = uuidv4();
        const userDevice = saveData.userDevice;
        const usersNamedFinn = await UserModel.find({
            $or: [{ mobileNumber: req.body.mobileNumber }
                , { email: req.body.email }]
        });
        if (usersNamedFinn.length > 0)
            return res.send("mobile number or email is duplicated");

        // Generate Password
        const password = await passwordService.generatePassword(req.body.password, saveData._id);
        if (_.isNil(password) || password == false)
            return res.send("error Happened");

        // Generate Token
        const token = await tokenService.generateLoginToken(saveData.userDevice, saveData._id, req.body.mobileNumber, 'user');
        if (_.isNil(token) || token == false)
            return res.send("error Happened 2");


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
            return res.send("error Happened 3");

        // Verification Number
        let verificationData = {};
        verificationData.userId = saveData._id;
        //  verificationData.id = uuidv4();
        verificationData.userDevice = userDevice;
        verificationData.mobileNumber = req.body.mobileNumber;
        verificationData.verificationType = 'register';
        let verificationCode = Math.floor(Math.random() * 90000000) + 1000000;
        verificationData.verificationCode = await passwordService.generatePassword(verificationCode, saveData.mobileNumber);
        verificationData.isVerified = false;
        let verfificationCreated = await Verifications.create(verificationData);
        if (_.isNil(verfificationCreated))
            return res.send("error Happened 4");
        await sendSmsService.sendActivationAccountsms(req, saveData.mobileNumber, verificationCode);
        return res.send(user);
    } catch (err) {
        return res.send(err);
    }
}