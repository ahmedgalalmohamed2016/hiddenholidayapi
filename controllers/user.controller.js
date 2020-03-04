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
// const 

exports.getCountries = async(req, res) => {
    try {
        let countries = await CountryModel.find({ isActive: true }, '-encExRate').sort('enName');
        return res.send(countries);

    } catch (err) {
        return res.send(err || { data: "Try in another time." });
    }
}

exports.getCategories = async(req, res) => {
    try {
        let categoriesData = await CategoryModel.find({ isActive: true });
        return res.send(categoriesData);

    } catch (err) {
        return res.send({ data: "Try in another time." });
    }
}

exports.adminGetUsers = async(req, res) => {
    try {
        let _skip = 0;
        let _query = {};
        if (!req.body.name)
            req.body.name = '';
        if (req.body.gender)
            _query.gender = req.body.gender;

        if (req.body.skip)
            _skip = req.body.skip * 50;

        console.log(_query);
        let _users = await UserModel.find({
            $or: [
                { firstName: { $regex: req.body.name, $options: "i" } },
                { lastName: { $regex: req.body.name, $options: "i" } },
                { country: { $regex: req.body.name, $options: "i" } },
                { mobileNumber: { $regex: req.body.name, $options: "i" } }
            ],
            role: 'user'
        }, '-password -userToken').limit(50).skip(_skip).sort('-lastLoginDate');
        return res.send(_users);
    } catch (err) {
        return res.status(405).send(err);
    }
}

exports.adminGetUserById = async(req, res) => {
    try {
        if (!req.body.id)
            return res.status(405).send("No user valid with this data");
        let _user = await UserModel.findOne({ _id: req.body.id, role: 'user' }, '-password -userToken');
        return res.send(_user);
    } catch (err) {
        return res.status(405).send(err);
    }
}

exports.adminUpdateUser = async(req, res) => {
    try {
        if (!req.body.id || !req.body.verifiedMobileNumber || !req.body.isLockedOut || !req.body.mobileNumber || !req.body.country || !req.body.firstName || !req.body.lastName)
            return res.send('Please enter required fields.');

        let data = {};
        data.firstName = req.body.firstName;
        data.lastName = req.body.lastName;
        data.email = req.body.email;
        data.mobileNumber = req.body.mobileNumber;
        data.country = req.body.country;
        data.isLockedOut = req.body.isLockedOut;
        data.verifiedMobileNumber = req.body.verifiedMobileNumber;

        let _user = await UserModel.findOne({ _id: req.body.id });
        if (!_user)
            return res.status(405).send("No bid found with this data");

        let _mobile = await UserModel.findOne({ mobileNumber: req.body.mobileNumber });
        console.log(_mobile._id + ' ' + _user._id);
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

exports.adminCreateUser = async(req, res) => {
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
            return res.send("mobile number is not available try another one");

        const password = await passwordService.generatePassword(req.body.password, saveData._id);
        if (_.isNil(password) || password == false)
            return res.send("error Happened");

        // Generate Token
        const token = await tokenService.generateLoginToken(saveData.userDevice, saveData._id, req.body.mobileNumber, 'user');
        if (_.isNil(token) || token == false)
            return res.send("error Happened");

        saveData.password = password;
        saveData.role = 'user';

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
            return res.send("error Happened while create new user.");

        return res.send(user);
    } catch (err) {
        return res.send({ data: err || "error" });
    }
}

exports.adminChangePassword = async(req, res) => {
    try {
        if (!req.body.id || !req.body.password)
            return res.status(405).send('Please enter required fields.');

        const _user = await UserModel.findOne({ _id: req.body.id, role: 'user' });
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

exports.register = async(req, res) => {
    try {
        if (!req.body.mobileNumber || !req.body.password || !req.body.country)
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
            return res.send("mobile number is not available try another one");
        // console.log("saveData----------");
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

        saveData.mobileNumber = req.body.mobileNumber;
        saveData.country = req.body.country;
        saveData.lastLoginDate = new Date();
        saveData.userNumber = makeUserCode(10);
        saveData.userToken = token;

        const user = await UserModel.create(saveData);
        if (_.isNil(user))
            return res.send("error Happened");

        // Verification Number
        let verificationData = {};
        verificationData.userId = saveData._id;
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

        sendSmsService.sendActivationAccountsms(req, saveData.mobileNumber, verificationCode);
        user._verificationCode = verificationCode;
        console.log(verificationCode);
        return res.send(user);
    } catch (err) {
        return res.send({ data: err || "error" });
    }
}

exports.resendSms = async(req, res) => {
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

exports.verifyPhone = async(req, res) => {
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
        return res.status(200).send("Mobile Verified Successfull.");
    } catch (err) {
        return res.send(err);
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

exports.loginFB = async(req, res) => {
    try {
        //get accessstokn
        //  get datafrombacebook & checked
        // create user with data
        //https://graph.facebook.com/debug_token?input_token=EAAC3370LuD0BAKg4yLKGxFQpD8QAOGcZCFNKjwAn0ogkTnkoYoSeMODldjOzw7OjZALJZCAe9yGm06YlJjb9JzbblqG4cCnJv2mhzoWeuZCfZB1XskEohMUnnYZBTvlTMVRSp1QZCkh7s69g5UEceMqTTvVthASR6PwiZAQhRGmaeeCA4qpLjAFVmVInTclrFlRllv7PHZC25XQZDZD&access_token=202171577251901|HMB7pcYCVXlcs1h9BSJjOgQ-iZE
        // https://graph.facebook.com/oauth/access_token?client_id=your-app-id&client_secret=your-app-secret&grant_type=client_credentials"202171577251901|HMB7pcYCVXlcs1h9BSJjOgQ-iZE 
        //https://graph.facebook.com/968200400056370?fields=id,name,email&access_token=EAAC3370LuD0BAKg4yLKGxFQpD8QAOGcZCFNKjwAn0ogkTnkoYoSeMODldjOzw7OjZALJZCAe9yGm06YlJjb9JzbblqG4cCnJv2mhzoWeuZCfZB1XskEohMUnnYZBTvlTMVRSp1QZCkh7s69g5UEceMqTTvVthASR6PwiZAQhRGmaeeCA4qpLjAFVmVInTclrFlRllv7PHZC25XQZDZD
        if (!req.body.accessToken)
            return res.status(401).send("Enter Valid token");
        let result = await superagent.get('https://graph.facebook.com/me').query({ access_token: req.body.accessToken });
        return res.send(result);
    } catch (err) {
        return res.send(err);
    }
}

exports.login = async(req, res) => {
    try {
        const usersNamedFinn = await UserModel.find({ mobileNumber: req.body.username });
        if (usersNamedFinn.length < 1)
            return res.status(405).send({ error: "Please enter valid username and password" });

        // if (usersNamedFinn[0].role != 'user')
        //     return res.status(405).send({ error: "Please enter valid username and password" });

        const password = await passwordService.comparePassword(req.body.password, usersNamedFinn[0].password, usersNamedFinn[0]._id);
        if (_.isNil(password) || password != true)
            return res.status(405).send({ error: "Please enter valid username and password" });

        if (usersNamedFinn[0].isLockedOut == true) {
            return res.status(405).send({ error: "Your account is locked,contact our support." });
        }

        // Generate Token
        let saveData = {};
        saveData.userDevice = uuidv4();

        // Generate Token
        const userToken = await tokenService.generateLoginToken(saveData.userDevice, usersNamedFinn[0]._id, usersNamedFinn[0].mobileNumber, usersNamedFinn[0].role);
        if (_.isNil(userToken) || userToken == false)
            return res.status(405).send({ error: "Please enter valid username and password" });

        saveData.userToken = userToken;
        saveData.lastLoginDate = new Date();

        const updatedUser = await UserModel.updateOne({ _id: usersNamedFinn[0]._id }, { $set: saveData });
        if (_.isNil(updatedUser) || updatedUser.length < 1)
            return res.status(405).send({ error: "Please enter valid username and password" });

        let getUser = await UserModel.findOne({ _id: usersNamedFinn[0]._id }).lean();
        if (_.isNil(getUser))
            return res.status(405).send({ error: "Please enter valid username and password" });
        return res.send(getUser);
    } catch (err) {
        return res.status(405).send(err);
    }
}

exports.checkPassword = async(req, res) => {
    try {
        console.log(req.body.password);
        if (!req.body.password) {
            return res.status(405).send({ error: "Please enter valid password" });
        }
        const password = await passwordService.comparePassword(req.body.password, req.userData.password, req.userData._id);
        console.log(password);
        if (_.isNil(password) || password != true)
            return res.status(405).send({ error: "Please enter valid password" });
        res.send(true);
    } catch (err) {

    }
}

exports.loginAdmin = async(req, res) => {
    try {
        const usersNamedFinn = await UserModel.find({
            mobileNumber: req.body.username
        });
        if (usersNamedFinn.length < 1)
            return res.status(405).send({ error: "Please enter valid username and password" });
        console.log(usersNamedFinn[0]._id);
        const password = await passwordService.comparePassword(req.body.password, usersNamedFinn[0].password, usersNamedFinn[0]._id);

        if (_.isNil(password) || password != true)
            return res.status(405).send({ error: "Please enter valid username and password" });

        if (usersNamedFinn[0].isLockedOut == true) {
            return res.status(405).send({ error: "Your account is locked,contact our support." });
        }


        // Generate Token
        let saveData = {};
        saveData.userDevice = uuidv4();

        // Generate Token.
        const userToken = await tokenService.generateLoginToken(saveData.userDevice, usersNamedFinn[0]._id, usersNamedFinn[0].mobileNumber, usersNamedFinn[0].role);
        if (_.isNil(userToken) || userToken == false)
            return res.status(405).send({ error: "Please enter valid username and password" });

        saveData.userToken = userToken;
        saveData.lastLoginDate = new Date();

        const updatedUser = await UserModel.updateOne({ _id: usersNamedFinn[0]._id }, { $set: saveData });
        if (_.isNil(updatedUser) || updatedUser.length < 1)
            return res.status(405).send({ error: "Please enter valid username and password" });

        let getUser = await UserModel.findOne({ _id: usersNamedFinn[0]._id }).lean();
        if (_.isNil(getUser))
            return res.status(405).send({ error: "Please enter valid username and password" });

        if (getUser.role != 'admin' && getUser.role != 'superAdmin')
            return res.status(405).send({ error: "Only Admin can access this portal" });
        return res.send(getUser);
    } catch (err) {
        return res.send(err);
    }
}

exports.logout = async(req, res) => {
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

exports.updateProfile = async(req, res) => {
    try {
        //req.userData

        var data = {}
        var verificationData = {}

        data.notificationEmail = req.body.notificationEmail;
        data.notificationMobile = req.body.notificationMobile;


        if (req.body.mobileNumber != req.userData.mobileNumber || req.body.email != req.userData.email) {
            const usersNamedFinn = await UserModel.find({
                $or: [{ mobileNumber: req.body.mobileNumber }, { email: req.body.email }]
            });
            if (usersNamedFinn.length > 0 && req.body.mobileNumber == usersNamedFinn[0].mobileNumber)
                return res.send("mobile number is not available try another one");

            else if (usersNamedFinn.length > 0 && req.body.email == usersNamedFinn[0].email)
                return res.send("email is not available try another one");

            else if (usersNamedFinn.length > 0)
                return res.send("mobile number or email is duplicated");
        }

        if (req.body.mobileNumber != req.userData.mobileNumber) {
            data.mobileNumber = req.body.mobileNumber;
            data.verifiedMobileNumber = false;
            verificationData.verificationType = 'update';

            let _a = String(Math.floor(Math.random() * 10));
            let _b = String(Math.floor(Math.random() * 10));
            let _c = String(Math.floor(Math.random() * 10));
            let _d = String(Math.floor(Math.random() * 10));
            let verificationCode = _a + _b + _c + _d;

            verificationData.verificationCode = await passwordService.generatePassword(verificationCode, req.body.mobileNumber);
            verificationData.isVerified = false;
            let verfificationCreated = await VerificationModel.create(verificationData);
            if (_.isNil(verfificationCreated))
                return res.send("error Happened");
            await sendSmsService.sendActivationAccountsms(req, req.body.mobileNumber, verificationCode);
            user._verificationCode = verificationCode;
        } else {
            data.mobileNumber = req.userData.mobileNumber;
        }

        if (req.body.email != req.userData.email)
            data.email = req.body.email;
        else
            data.eamil = req.userData.email;

        const updatedUser = await UserModel.findByIdAndUpdate(req.userData._id, data).lean();
        if (_.isNil(updatedUser))
            return res.status(401).send("Error Happened ,contact our support.");
        return res.send(updatedUser);
    } catch (err) {
        return res.send(err);
    }
}

exports.updateSocket = async(req, res) => {
    try {
        if (!req.body.socketId)
            return res.send("enter valid socket id")

        const updatedUser = await UserModel.findByIdAndUpdate(req.userData._id, { socketId: req.body.socketId }).lean();
        if (_.isNil(updatedUser))
            return res.status(401).send("Error Happened ,contact our support.");
        return res.send(updatedUser);
    } catch (err) {
        return res.send(err);
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