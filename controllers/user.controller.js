const merchant = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const Verifications = require('../models/verification.model');
const passwordService = require('../services/passwordService');
const sendSmsService = require('../services/sendSmsService');
const tokenService = require('../services/tokenService');

const _ = require("lodash");
const request = require("superagent");
const fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
// const 

exports.register = async(req, res) => {
    try {

        if (!req.body.mobileNumber || !req.body.email || !req.body.firstName || !req.body.lastName)
            return res.send('Please enter required fields.');
        let saveData = {};
        saveData._id = new mongoose.Types.ObjectId;
        saveData.userDevice = uuidv4();
        const userDevice = saveData.userDevice;
        const usersNamedFinn = await UserModel.find({
            $or: [{ mobileNumber: req.body.mobileNumber }, { email: req.body.email }]
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
        let verificationCode = Math.floor(Math.random() * 90000000) + 1000000;
        verificationData.verificationCode = await passwordService.generatePassword(verificationCode, saveData.mobileNumber);
        verificationData.isVerified = false;
        let verfificationCreated = await Verifications.create(verificationData);
        if (_.isNil(verfificationCreated))
            return res.send("error Happened");
        await sendSmsService.sendActivationAccountsms(req, saveData.mobileNumber, verificationCode);
        return res.send(user);
    } catch (err) {
        return res.send({ data: "error" });
    }
}

exports.getUserData = async(req, res) => {
    try {
        //console.log(req.userData);
        return res.send(req.userData);
    } catch (err) {
        return res.send(err);
    }
}

exports.login = async(req, res) => {
    try {
        const usersNamedFinn = await UserModel.find({
            $or: [{ mobileNumber: req.body.mobileNumber }, { email: req.body.email }]
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

        const updatedUser = await UserModel.findByIdAndUpdate(usersNamedFinn[0]._id, saveData).lean();
        if (_.isNil(updatedUser) || updatedUser.length < 1)
            return res.status(405).send("Please enter valid username / password");
        return res.send(updatedUser);
    } catch (err) {
        return res.send(err);
    }

}