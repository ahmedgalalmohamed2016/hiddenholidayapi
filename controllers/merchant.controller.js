const merchant = require('../models/merchant.model');
const CategoryModel = require('../models/categories.model');
const TransactionModel = require('../models/transaction.model');
const countryModel = require('../models/country.model');
const packageModel = require('../models/package.model');
const UserModel = require('../models/user.model');
const DealModel = require('../models/deal.model');
const RequestModel = require('../models/request.model');
const VerificationModel = require('../models/verification.model');
const passwordService = require('../services/passwordService');
const sendSmsService = require('../services/sendSmsService');
const tokenService = require('../services/tokenService');
const TransactionService = require('../services/transactionService');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');


exports.adminCreate = async (req, res) => {
    try {
        if (!req.body.mobileNumber || !req.body.password)
            return res.status(404).send({ statusCode: 404, message: 'Please enter required fields.' });
        let saveData = {};
        let transactionData = {};
        saveData._id = new mongoose.Types.ObjectId;
        saveData.userDevice = uuidv4();
        const userDevice = saveData.userDevice;

        const usersNamedFinn = await UserModel.find({ mobileNumber: req.body.mobileNumber }).lean();
        if (usersNamedFinn.length > 0 && req.body.mobileNumber == usersNamedFinn[0].mobileNumber)
            return res.status(404).send({ statusCode: 404, message: "mobile number is not available try another one" });

        const merchantFinn = await merchant.find({ $or: [{ name: req.body.name }, { clean_name: req.body.clean_name }] });

        if (merchantFinn.length > 0)
            return res.send({ statusCode: 405, message: "Merchant name is not available try another one" });

        const transactionFrom = await UserModel.findOne({ role: "superAdmin" });
        if (!transactionFrom._id)
            return res.send({ statusCode: 405, message: "Error Happened try in another time" });

        const categoryData = await CategoryModel.findOne({ enName: req.body.category });
        if (!categoryData._id)
            return res.send({ statusCode: 405, message: "Error Happened try in another time" });

        let packageId = await packageModel.findOne({ enName: "Free Package" });
        if (!packageId._id)
            return res.send({ statusCode: 405, message: "error Happened to find package" });

        let countryData = await countryModel.findOne({ enName: req.body.country });
        if (!countryData._id)
            return res.send({ statusCode: 405, message: "error Happened to find countryData" });

        // Generate Password
        const password = await passwordService.generatePassword(req.body.password, saveData._id);
        if (_.isNil(password) || password == false)
            return res.send({ statusCode: 405, message: "error Happened" });

        // Generate Token
        const token = await tokenService.generateLoginToken(saveData.userDevice, saveData._id, req.body.mobileNumber, 'merchant');
        if (_.isNil(token) || token == false)
            return res.send({ statusCode: 405, message: "error Happened" });

        saveData.password = password;
        saveData.role = 'merchant';

        saveData.mobileNumber = req.body.mobileNumber;
        saveData.firstName = req.body.firstName;
        saveData.lastName = req.body.lastName;
        saveData.lastLoginDate = new Date();
        saveData.userNumber = makeUserCode(10);
        saveData.userToken = token;
        saveData.country = req.body.country;
        saveData.merchant = new mongoose.Types.ObjectId;
        saveData.isApproved = false;

        let merchantData = {};
        merchantData._id = saveData.merchant;
        merchantData.userId = req.userData._id;
        merchantData.country = req.body.country;
        merchantData.main_phone_number = req.body.main_phone_number;
        merchantData.clean_name = req.body.clean_name;
        merchantData.name = req.body.name;
        merchantData.contact_person = req.body.firstName + ' ' + req.body.lastName;
        merchantData.cat_name = req.body.category;
        merchantData.categoryId = categoryData._id;
        merchantData.address = req.body.address;
        merchantData.packageId = packageId._id;
        merchantData.merchantSource = "Application";
        merchantData.emails = req.body.emails;
        merchantData.countryId = countryData._id;

        if (_.isNil(merchantData.categoryId))
            return res.send({ statusCode: 405, message: "Error", data: { category: merchantData.categoryId } });

        const _merchant = await merchant.create(merchantData);
        if (_.isNil(_merchant))
            return res.status(404).send({ statusCode: 404, message: "error Happened while create merchant account" });

        const user = await UserModel.create(saveData);
        if (_.isNil(user))
            return res.status(404).send({ statusCode: 404, message: "error Happened while create user account" });

        transactionData.fromUserId = transactionFrom._id;
        transactionData.toUserId = saveData._id;
        transactionData.grossAmount = categoryData.initBalance * countryData.exRate;
        transactionData.netAmount = transactionData.grossAmount;
        transactionData.merchantAmount = 0;
        transactionData.currency = countryData.currency;

        transactionData.status = "approved";
        transactionData.sourceType = "Init";
        transactionData.comment = "This is free init balance.";
        transactionData.paymentMethod = "virtual";
        transactionData.code = makeUserCode(10);
        transactionData.creationDate = new Date();
        transactionData.sharePercentage = '0';
        //sourceData {senderName , recieverName  }
        transactionData.sourceData = {};
        transactionData.sourceData.senderName = transactionFrom.firstName + ' ' + transactionFrom.lastName;
        transactionData.sourceData.receiverName = merchantData.name;
        transactionData.paymentId = null;
        //sourceData {senderName , recieverName  }

        let transactionResult = await TransactionService.createTransaction(transactionData);
        if (transactionResult == false)
            return res.status(401).send("error Happened while create transaction");

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
            return res.status(404).send({ statusCode: 404, message: "error Happened" });
        sendSmsService.sendActivationAccountsms(req, saveData.mobileNumber, verificationCode);
        user._verificationCode = verificationCode;

        return res.status(200).send({ statusCode: 200, message: "Success", data: { user: user, merchant: _merchant } });
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message: "Error", data: err });
    }
}
exports.create = async (req, res) => {
    try {
        if (!req.body.mobileNumber || !req.body.password)
            return res.status(404).send({ statusCode: 404, message: 'Please enter required fields.' });
        let saveData = {};
        let transactionData = {};
        saveData._id = new mongoose.Types.ObjectId;
        saveData.userDevice = uuidv4();
        const userDevice = saveData.userDevice;

        const usersNamedFinn = await UserModel.find({ mobileNumber: req.body.mobileNumber }).lean();
        if (usersNamedFinn.length > 0 && req.body.mobileNumber == usersNamedFinn[0].mobileNumber)
            return res.status(404).send({ statusCode: 404, message: "mobile number is not available try another one" });

        const merchantFinn = await merchant.find({ $or: [{ name: req.body.name }, { clean_name: req.body.clean_name }] });

        if (merchantFinn.length > 0)
            return res.status(404).send({ statusCode: 404, message: "Merchant name is not available try another one" });

        const transactionFrom = await UserModel.findOne({ role: "superAdmin" });
        if (!transactionFrom._id)
            return res.status(404).send({ statusCode: 404, message: "Error Happened try in another time" });

        // const merchantAdmin = await UserModel.findOne({ role: "merchantAdmin", _id: req.userData._id });
        // if (!merchantAdmin._id)
        //     return res.status(405).send("Error Happened try in another time 5");

        const categoryData = await CategoryModel.findOne({ enName: req.body.category });
        if (!categoryData._id)
            return res.status(404).send({ statusCode: 404, message: "Error Happened try in another time" });

        let packageId = await packageModel.findOne({ enName: "Free Package" });
        if (!packageId._id)
            return res.status(404).send({ statusCode: 404, message: "error Happened to find package" });

        let countryData = await countryModel.findOne({ enName: req.body.country });
        if (!countryData._id)
            return res.status(404).send({ statusCode: 404, message: "error Happened to find countryData" });

        // Generate Password
        const password = await passwordService.generatePassword(req.body.password, saveData._id);
        if (_.isNil(password) || password == false)
            return res.status(404).send({ statusCode: 404, message: "error Happened" });

        // Generate Token
        const token = await tokenService.generateLoginToken(saveData.userDevice, saveData._id, req.body.mobileNumber, 'merchant');
        if (_.isNil(token) || token == false)
            return res.status(404).send({ statusCode: 404, message: "error Happened" });

        saveData.password = password;
        saveData.role = 'merchant';

        saveData.mobileNumber = req.body.mobileNumber;
        saveData.firstName = req.body.firstName;
        saveData.lastName = req.body.lastName;
        saveData.lastLoginDate = new Date();
        saveData.userNumber = makeUserCode(10);
        saveData.userToken = token;
        saveData.country = req.body.country;
        saveData.merchant = new mongoose.Types.ObjectId;
        saveData.isApproved = false;

        let merchantData = {};
        merchantData._id = saveData.merchant;
        merchantData.userId = req.userData._id;
        merchantData.country = req.body.country;
        merchantData.main_phone_number = req.body.main_phone_number;
        merchantData.clean_name = req.body.clean_name;
        merchantData.name = req.body.name;
        merchantData.contact_person = req.body.firstName + ' ' + req.body.lastName;
        merchantData.cat_name = req.body.category;
        merchantData.categoryId = categoryData._id;
        merchantData.address = req.body.address;
        merchantData.packageId = packageId._id;
        merchantData.merchantSource = "Application";
        merchantData.emails = req.body.emails;
        merchantData.countryId = countryData._id;

        if (_.isNil(merchantData.categoryId))
            return res.send({ statusCode: 405, message: "Error", data: { dd: merchantData.categoryId } });

        const _merchant = await merchant.create(merchantData);
        if (_.isNil(_merchant))
            return res.status(404).send({ statusCode: 404, message: "error Happened while create merchant account" });

        const user = await UserModel.create(saveData);
        if (_.isNil(user))
            return res.status(404).send({ statusCode: 404, message: "error Happened while create user account" });

        transactionData.fromUserId = transactionFrom._id;
        transactionData.toUserId = saveData._id;
        transactionData.grossAmount = categoryData.initBalance * countryData.exRate;
        transactionData.netAmount = transactionData.grossAmount;
        transactionData.merchantAmount = 0;
        transactionData.currency = countryData.currency;

        transactionData.status = "approved";
        transactionData.sourceType = "Init";
        transactionData.comment = "This is free init balance.";
        transactionData.paymentMethod = "virtual";
        transactionData.code = makeUserCode(10);
        transactionData.creationDate = new Date();
        transactionData.sharePercentage = '0';
        //sourceData {senderName , recieverName  }
        transactionData.sourceData = {};
        transactionData.sourceData.senderName = transactionFrom.firstName + ' ' + transactionFrom.lastName;
        transactionData.sourceData.receiverName = merchantData.name;

        //sourceData {senderName , recieverName  }

        let transactionResult = await TransactionService.createTransaction(transactionData);
        if (transactionResult == false)
            return res.send({ statusCode: 401, message: "error Happened while create transaction" });

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
            return res.status(404).send({ statusCode: 404, message: "error Happened" });
        sendSmsService.sendActivationAccountsms(req, saveData.mobileNumber, verificationCode);
        user._verificationCode = verificationCode;

        return res.status(200).send({ statusCode: 200, message: "Success", data: { user: user, merchant: _merchant } });
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message: "Error", data: err });
    }
}

exports.adminUpdate = async (req, res) => {
    try {
        if (!req.body.id)
            return res.status(404).send({ statusCode: 404, message: "No merchant found with this data" });

        if (req.body.country)
            delete req.body.country;

        let _merchant = await merchant.findOne({ _id: req.body.id });
        if (!_merchant)
            return res.status(404).send({ statusCode: 404, message: "No bid found with this data" });

        let _res = await merchant.findOneAndUpdate({ _id: req.body.id }, { $set: req.body }, { new: true });
        if (!_res)
            return res.status(404).send({ statusCode: 404, message: "Can not update this merchant,try in another time." });
        return res.status(200).send({ statusCode: 200, message: "Success", data: _res });
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message: "Error", data: err || "Error Happened" });
    }
}

exports.checkPassword = async (req, res) => {
    try {
        console.log(req.body.password);
        if (!req.body.password) {
            return res.send({ statusCode: 405, message: "Please enter valid password" });
        }
        const password = await passwordService.comparePassword(req.body.password, req.userData.password, req.userData._id);
        console.log(password);
        if (_.isNil(password) || password != true)
            return res.send({ statusCode: 405, message: "Please enter valid password" });
        res.send(true);
    } catch (err) {

    }
}



exports.registerMerchant = async (req, res) => {
    try {

        if (!req.body.mobileNumber || !req.body.firstName || !req.body.lastName || !req.body.password)
            return res.status(404).send({ statusCode: 404, message: 'Please enter required fields.' });
        let saveData = {};
        saveData._id = new mongoose.Types.ObjectId;
        saveData.userDevice = uuidv4();
        const userDevice = saveData.userDevice;
        const usersNamedFinn = await UserModel.find({
            $or: [{ mobileNumber: req.body.mobileNumber }, { email: req.body.email }]
        });
        if (usersNamedFinn.length > 0 && req.body.mobileNumber == usersNamedFinn[0].mobileNumber)
            return res.status(404).send({ statusCode: 404, message: "mobile number is not available try another one" });

        else if (usersNamedFinn.length > 0 && req.body.email == usersNamedFinn[0].email)
            return res.status(404).send({ statusCode: 404, message: "email is not available try another one" });

        else if (usersNamedFinn.length > 0)
            return res.status(404).send({ statusCode: 404, message: "mobile number or email is duplicated" });

        // Generate Password
        const password = await passwordService.generatePassword(req.body.password, saveData._id);
        if (_.isNil(password) || password == false)
            return res.status(404).send({ statusCode: 404, message: "error Happened" });

        // Generate Token
        const token = await tokenService.generateLoginToken(saveData.userDevice, saveData._id, req.body.mobileNumber, 'merchant');
        if (_.isNil(token) || token == false)
            return res.status(404).send({ statusCode: 404, message: "error Happened" });

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
            return res.status(404).send({ statusCode: 404, message: "error Happened" });

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
            return res.status(404).send({ statusCode: 404, message: "error Happened" });
        await sendSmsService.sendActivationAccountsms(req, saveData.mobileNumber, verificationCode);
        user._verificationCode = verificationCode;
        console.log(verificationCode);
        return res.status(200).send({ statusCode: 200, message: "Success", data: user });
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message: "error" });
    }
}

exports.maps = async (req, res) => {
    try {
        let result = await merchant.find({}, 'clean_name cat_name location_long location_lat _id');
        return res.status(404).send({ statusCode: 404, message: "Success", data: result });
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message: err.message });
    }
};

exports.meMerchantById = async (req, res) => {
    try {
        let _merchants = await merchant.find({ userId: req.userData._id }).populate('categoryId');
        if (!_merchants)
            return res.send({ statusCode: 405, message: "Please enter valid merchant data" });
        return res.status(200).send({ statusCode: 200, message: "Success", data: _merchants });
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message: err.message });
    }
};

exports.listMerchantById = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(404).send({ statusCode: 404, message: "Please enter valid merchant id" });
        }
        let _merchants = await merchant.findOne({ _id: req.body.id });
        if (!_merchants)
            return res.status(404).send({ statusCode: 404, message:"Please enter valid merchant data"});
        return res.status(200).send({ statusCode: 200, message: "Success", data: _merchants });
    } catch (err) {
        console.log(err);
        return res.status(404).send({ statusCode: 404, message:err.message});
    }
};

exports.adminMerchantById = async (req, res) => {
    try {
        console.log(req.body.id);
        let _merchants = await merchant.find({ _id: req.body.id }).populate('categoryId').populate('countryId').populate('userId');
        if (!_merchants)
            return res.status(404).send({ statusCode: 404, message:"Please enter valid merchant data"});
        return res.status(200).send({ statusCode: 200, message:"Success",data:_merchants});
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err.message});
    }
};

exports.merchantById = async (req, res) => {
    try {
        let _merchants = await merchant.find({ _id: req.body.id }).populate('categoryId').populate('countryId').populate('userId');
        if (!_merchants)
            return res.status(404).send({ statusCode: 404, message:"Please enter valid merchant data"});
        return res.status(404).send({ statusCode: 404, message:"Success",data:_merchants});
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err.message});
    }
};

exports.me = async (req, res) => {
    try {
        let _merchants = await merchant.findById({ _id: req.merchantData.id });
        if (!_merchants)
            return res.status(404).send({ statusCode: 404, message:"Please enter valid merchant data"});
        req.userData.merchant = _merchants;
        return res.status(200).send({ statusCode: 200, message:"Success",data:req.userData});
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err.message});
    }
};



exports.totalDeals = async (req, res) => {
    try {
        let data = {};

        data.totalEarn = 0;
        data.totalPay = 0;

        let _Deals = await DealModel.find({ merchantId: req.merchantData._id });
        if (!_Deals)
            return res.status(404).send({ statusCode: 404, message:"Please enter valid merchant data"});

        data.dealRequests = _Deals.length;
        data.bidsRequests = 0;

        for (let x = 0; x < _Deals.length; x++) {
            if (_Deals[x].type == 'fixed' && _Deals[x].status == 'accept') {
                data.totalEarn = data.totalEarn + (parseInt(_Deals[x].price) - parseInt(_Deals[x].amount));
                data.totalPay = data.totalPay + (parseInt(_Deals[x].amount));
            }
            if (_Deals[x].type == 'percentage' && _Deals[x].status == 'accept') {
                let _p = parseInt(_Deals[x].price) - parseInt(_Deals[x].price) * (parseInt(_Deals[x].amount) / 100);
                data.totalEarn = data.totalEarn + _p;
                data.totalPay = data.totalPay + (parseInt(_Deals[x].price) - _p);
            }
        }


        return res.status(200).send({ statusCode: 200, message:"Success",data:data});
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err.message});
    }
};

exports.update = async (req, res) => {
    try {
        let _query = {};
        if (req.body.merchant.isActiveMerchant) {
            if (req.body.merchant.isActiveMerchant == 'true')
                _query.isActiveMerchant = true;
            else
                _query.isActiveMerchant = false;
        }


        if (req.body.merchant.isActivePromotion) {
            if (req.body.merchant.isActivePromotion == 'true')
                _query.isActivePromotion = true;
            else
                _query.isActivePromotion = false;
        }


        if (req.body.merchant.isActiveBids) {
            if (req.body.merchant.isActiveBids == 'true')
                _query.isActiveBids = true;
            else
                _query.isActiveBids = false;
        }

        const updatedMerchant = await merchant.updateOne({ clean_name: req.merchantData.name }, { $set: _query }, { new: true });
        if (_.isNil(updatedMerchant))
            return res.status(404).send({ statusCode: 404, message: "We can not update merchant.Try in another time." });
        return res.status(200).send({ statusCode: 200,message: "Updated Success."  });
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err.message || "We can not update merchant.Try in another time."});
    }
};

exports.totalSummary = async (req, res) => {
    try {
        let data = {};

        data.totalDealsRequests = await RequestModel.count({ type: 'deal', merchantId: req.merchantData.id });
        data.totalBidsRequests = await RequestModel.count({ type: 'bid', merchantId: req.merchantData.id });
        data.totalDeals = await DealModel.count({ type: 'deal', merchantId: req.merchantData.id, isArchived: false, isActive: true });
        data.totalBids = await DealModel.count({ type: 'bid', merchantId: req.merchantData.id, isArchived: false, isActive: true });

        return res.status(200).send({ statusCode: 200, message:"Success",data:data});
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err});
    }
}


exports.home = async (req, res) => {
    try {
        let data = {};

        let _skip = getRandomArbitrary(1, 10);
        data._foods = await merchant.find({ cat_name: "Foods" }).limit(8).skip(_skip).orFail((err) => Error(err));

        _skip = getRandomArbitrary(1, 10);
        data._discover = await merchant.find({ cat_name: "Discover Jordan" }).limit(8).skip(_skip).orFail((err) => Error(err));

        _skip = getRandomArbitrary(1, 10);
        data._around_town = await merchant.find({ cat_name: "Around Town" }).limit(8).skip(_skip).orFail((err) => Error(err));

        _skip = getRandomArbitrary(1, 5);
        data._coffe = await merchant.find({ cat_name: "Coffee" }).limit(8).skip(_skip).orFail((err) => Error(err));

        _skip = getRandomArbitrary(1, 7);
        data._night_life = await merchant.find({ cat_name: "Nightlife" }).limit(8).skip(_skip).orFail((err) => Error(err));

        data._deals = await merchant.find({ promotion: { $ne: null } }).limit(8).orFail((err) => Error(err));

        return res.status(200).send({ statusCode: 200, message:"Success",data:data});
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err.message});
    }
};

function getRandomArbitrary(min, max) {
    return parseInt((Math.random() * (max - min) + min));
}

exports.merchants = async (req, res) => {
    try {
        let _query = {};
        let _skip = 0;
        //
        if (req.query.name)
            _query.clean_name = { $regex: req.query.name, $options: "i" } //{ contains: req.query.name };

        if (req.query.category)
            _query.categoryId = req.query.category;

        if (req.query.country)
            _query.country = req.query.country;

        console.log(_query);

        if (req.query.page)
            _skip = req.query.page * 10;
        let _merchants = await merchant.find(_query, null, { sort: { clean_name: 1 } }).populate('categoryId').limit(10).skip(_skip);
        console.log(_merchants);
        if (!_merchants)
            return res.status(405).send('Error Happened');
        return res.send(_merchants);
    } catch (err) {
        // mongoose.connection.close();
        return res.send(err.message);
    }
};



exports.merchantsDummy = async (req, res) => {
    try {
        let rawdata = fs.readFileSync('./json/dummy.json');
        let _cresult = JSON.parse(rawdata);
        let _merchants = await merchant.create(_cresult);
        return res.status(200).send({ statusCode: 200, message:"Success",data:_merchants});
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err.message});
    }
};

exports.merchants_favourites = async (req, res) => {
    try {
        if (!req.body.merchants || req.body.merchants.length < 1)
            return res.status(404).send({ statusCode: 404, message:"Please enter valid favourites data"});

        let data = [];
        console.log(typeof req.body);
        console.log(typeof req.body.merchants);
        // return res.send(req.body);
        for (let x = 0; x <= req.body.merchants.length; x++) {
            let d = mongoose.Types.ObjectId(req.body.merchants[x]);
            data.push(d);
        }
        let _merchants = await merchant.find({ _id: { $in: data } }, null, { sort: { clean_name: 1 } }).populate('categoryId');
        return res.status(200).send({ statusCode: 200, message:"Success",data:_merchants});
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err});
    }
};

// exports.updateMerchant = async (req, res) => {
//     try {
//         let _merchants = await merchant.updateMany({}, { country: "Jordan" }).lean();

//         return res.send(_merchants);
//     } catch (err) {
//         return res.send(err.message);
//     }
// };

// exports.updateDummyMerchant = async (req, res) => {
//     try {

//         // let du

//         let _merchants = await merchant.updateMany({}, { is_active: true }).lean();

//         return res.send(_merchants);
//     } catch (err) {
//         return res.send(err.message);
//     }
// };

exports.merchant_prepare = async (req, res) => {
    try {
        let rawdata = fs.readFileSync("items.json");
        let data = JSON.parse(rawdata);

        // for (let x = 0; x < data.length; x++) {
        //     data[x].id = uuidv4();
        // }
        // const _merchants = await Merchants.createEach(data).fetch();
        // if (_.isNil(_merchants)) return 404;
        // return res.send(data);
        // let merchantdata = new merchant(data);
        let result = await merchant.insertMany(data);
        return res.status(200).send({ statusCode: 200, message:"Success",data:result});
    } catch (err) {

        return res.status(404).send({ statusCode: 404, message:err.message});
    }
};

// exports.getAirports = async(req, res) => {
//     try {
// let rawdata = fs.readFileSync("json/airports.json");
// let data = JSON.parse(rawdata);
// console.log(data.length);

// let dd = [];
// for (let x = 0; x < 10000; x++) {
//    dd.push(data[x]);
// }
// const _merchants = await Merchants.createEach(data).fetch();
// if (_.isNil(_merchants)) return 404;
// return res.send(data);
// let merchantdata = new merchant(data);
//         let result = await AirportModel.insertMany(dd);
//         return res.send(result);
//     } catch (err) {

//         return res.send(err.message);
//     }
// };

function makeUserCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}