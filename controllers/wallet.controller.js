const merchant = require("../models/merchant.model");
const CategoryModel = require("../models/categories.model");
const TransactionModel = require("../models/transaction.model");
const countryModel = require("../models/country.model");
const packageModel = require("../models/package.model");
const CardModel = require("../models/card.model");
const RequestModel = require("../models/request.model");
const UserModel = require("../models/user.model");
const DealModel = require("../models/deal.model");
const VerificationModel = require("../models/verification.model");
const passwordService = require("../services/passwordService");
const sendSmsService = require("../services/sendSmsService");
const tokenService = require("../services/tokenService");
const TransactionService = require("../services/transactionService");
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require("mongoose");
const uuidv4 = require("uuid/v4");

exports.balance = async (req, res) => {
  try {
    let data = {};
    data.availableBalance = 0;
    data.virtualBalance = 0;
    data.currentBalance = 0;

    data.currency = await countryModel.findOne(
      { enName: req.merchantData.country },
      "-_id currency"
    );
    if (!data.currency)
      return res.status(404).send({ statusCode: 404, message:"Error Happened please try again later."});

    let transactions = await TransactionModel.find({
      status: "approved",
      $or: [{ fromUserId: req.userData._id }, { toUserId: req.userData._id }],
    });
    if (!transactions)
      return res.status(404).send({ statusCode: 404, message:"Error Happened please try again later."});

    for (let x = 0; x < transactions.length; x++) {
      if (transactions[x].paymentMethod == "virtual") {
        if (String(transactions[x].toUserId) == String(req.userData._id)) {
          data.virtualBalance = data.virtualBalance + transactions[x].amount;
        } else if (
          String(transactions[x].fromUserId) == String(req.userData._id)
        ) {
          data.virtualBalance = data.virtualBalance - transactions[x].amount;
        }
      } else if (transactions[x].paymentMethod != "virtual") {
        if (String(transactions[x].fromUserId) == String(req.userData._id)) {
          data.availableBalance =
            data.availableBalance + transactions[x].amount;
        } else if (
          String(transactions[x].toUserId) == String(req.userData._id)
        ) {
          data.availableBalance =
            data.availableBalance - transactions[x].amount;
        }
      }
    }
    data.currency = data.currency.currency;
    data.availableBalance = parseInt(data.availableBalance);
    data.virtualBalance = parseInt(data.virtualBalance);
    data.currentBalance = data.availableBalance + data.virtualBalance;
    res.status(200).send({ statusCode: 200, message:"Success",data:data});
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message:err.message});
  }
};

exports.adminMerchantBalance = async (req, res) => {
  try {
    let data = {};
    data.availableBalance = 0;
    data.virtualBalance = 0;
    data.currentBalance = 0;

    let _merchant = await merchant.findById({ _id: req.body.merchantId });
    if (!_merchant)
      return res.status(404).send({ statusCode: 404, message:"Please enter valid merchant data"});

    let _user = await UserModel.findOne({ merchant: req.body.merchantId });
    if (!_user) return res.status(404).send({ statusCode: 404, message:"Please enter valid merchant data"});

    data.currency = await countryModel.findOne(
      { enName: _merchant.country },
      "-_id currency"
    );
    if (!data.currency)
      return res.status(404).send({ statusCode: 404, message:"Error Happened please try again later."});

    let transactions = await TransactionModel.find({
      status: "approved",
      $or: [{ fromUserId: _user._id }, { toUserId: _user._id }],
    });
    if (!transactions)
      return res.status(404).send({ statusCode: 404, message:"Error Happened please try again later."});
    for (let x = 0; x < transactions.length; x++) {
      if (transactions[x].paymentMethod == "virtual") {
        if (String(transactions[x].toUserId) == String(_user._id)) {
          data.virtualBalance =
            data.virtualBalance + transactions[x].grossAmount;
        } else if (String(transactions[x].fromUserId) == String(_user._id)) {
          data.virtualBalance =
            data.virtualBalance - transactions[x].grossAmount;
        }
      } else if (transactions[x].paymentMethod != "virtual") {
        if (String(transactions[x].fromUserId) == String(_user._id)) {
          data.availableBalance =
            data.availableBalance + transactions[x].merchantAmount;
        } else if (String(transactions[x].toUserId) == String(_user._id)) {
          data.availableBalance =
            data.availableBalance - transactions[x].merchantAmount;
        }
      }
    }
    data.currency = data.currency.currency;
    data.availableBalance = parseInt(data.availableBalance);
    data.virtualBalance = parseInt(data.virtualBalance);
    data.currentBalance = data.availableBalance + data.virtualBalance;
    res.status(200).send({ statusCode: 200, message:"Success",data:data});
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message:err.message});
  }
};

exports.merchantBalance = async (req, res) => {
  try {
    let data = {};
    data.availableBalance = 0;
    data.virtualBalance = 0;
    data.currentBalance = 0;

    data.currency = await countryModel.findOne(
      { enName: req.userData.country },
      "-_id currency"
    );
    if (!data.currency)
      return res.status(404).send({ statusCode: 404, message:"Error Happened please try again later."});

    let transactions = await TransactionModel.find({
      status: "approved",
      $or: [{ fromUserId: req.userData._id }, { toUserId: req.userData._id }],
    });
    if (!transactions)
      return res.status(404).send({ statusCode: 404, message:"Error Happened please try again later."});

    for (let x = 0; x < transactions.length; x++) {
      if (transactions[x].paymentMethod == "virtual") {
        if (String(transactions[x].toUserId) == String(req.userData._id)) {
          data.virtualBalance =
            data.virtualBalance + transactions[x].grossAmount;
        } else if (
          String(transactions[x].fromUserId) == String(req.userData._id)
        ) {
          data.virtualBalance =
            data.virtualBalance - transactions[x].grossAmount;
        }
      } else if (transactions[x].paymentMethod != "balance") {
        // if (String(transactions[x].fromUserId) == String(req.userData._id)) {
        data.availableBalance =
          data.availableBalance +
          transactions[x].netAmount +
          transactions[x].merchantAmount;
        // } else if (String(transactions[x].toUserId) == String(req.userData._id)) {
        //     data.availableBalance = data.availableBalance - transactions[x].netAmount;
        // }
        //let userB = await TransactionService.getUserBalance(req.userData.id);
      }
    }
    data.currency = data.currency.currency;
    data.availableBalance = parseInt(data.availableBalance);
    data.virtualBalance = parseInt(data.virtualBalance);
    data.currentBalance = data.availableBalance + data.virtualBalance;
    res.status(200).send({ statusCode: 200, message:"Success",data:data});
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message:err.message});
  }
};

exports.userBalance = async (req, res) => {
  try {
    let data = {};
    data.availableBalance = 0;
    data.virtualBalance = 0;
    data.currentBalance = 0;

    data.currency = await countryModel.findOne(
      { enName: req.userData.country },
      "-_id currency"
    );
    if (!data.currency)
      return res.status(404).send({ statusCode: 404, message:"Error Happened please try again later."});

    let transactions = await TransactionModel.find({
      status: "approved",
      $or: [{ fromUserId: req.userData._id }, { toUserId: req.userData._id }],
    });
    if (!transactions)
      return res.status(404).send({ statusCode: 404, message:"Error Happened please try again later."});

    for (let x = 0; x < transactions.length; x++) {
      if (transactions[x].paymentMethod == "virtual") {
        if (String(transactions[x].toUserId) == String(req.userData._id)) {
          data.virtualBalance =
            data.virtualBalance + transactions[x].grossAmount;
        } else if (
          String(transactions[x].fromUserId) == String(req.userData._id)
        ) {
          data.virtualBalance =
            data.virtualBalance - transactions[x].grossAmount;
        }
      } else if (transactions[x].paymentMethod != "balance") {
        // if (String(transactions[x].fromUserId) == String(req.userData._id)) {
        data.availableBalance =
          data.availableBalance +
          transactions[x].netAmount +
          transactions[x].merchantAmount;
        // } else if (String(transactions[x].toUserId) == String(req.userData._id)) {
        //     data.availableBalance = data.availableBalance - transactions[x].netAmount;
        // }
        //let userB = await TransactionService.getUserBalance(req.userData.id);
      }
    }
    data.currency = data.currency.currency;
    data.availableBalance = parseInt(data.availableBalance);
    data.virtualBalance = parseInt(data.virtualBalance);
    data.currentBalance = data.availableBalance + data.virtualBalance;
    res.status(200).send({ statusCode: 200, message:"Success",data:data});
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message:err.message});
  }
};

exports.hiddenHolidayBalance = async (req, res) => {
  try {
    let data = {};
    data.availableBalance = 0;
    data.virtualBalance = 0;
    data.currentBalance = 0;

    let _mainUser = await UserModel.findOne({ role: "superAdmin" });
    if (!_mainUser)
      return res.status(404).send({ statusCode: 404, message:"Error Happened please try again later."});
    req.userData = _mainUser;

    let _country = await countryModel.findOne({ enName: req.userData.country });
    if (!_country)
      return res.status(404).send({ statusCode: 404, message:"Error Happened please try again later."});

    data.currency = _country.currency;
    data.exRate = _country.exRate;

    let _countries = await countryModel.find({});
    if (!_countries)
      return res.status(404).send({ statusCode: 404, message:"Error Happened please try again later."});

    let transactions = await TransactionModel.find({
      status: "approved",
      $or: [{ fromUserId: req.userData._id }, { toUserId: req.userData._id }],
    });
    if (!transactions)
      return res.status(404).send({ statusCode: 404, message:"Error Happened please try again later."});

    for (let x = 0; x < transactions.length; x++) {
      if (data.currency != transactions[x].currency) {
        for (let tc = 0; tc < _countries.length; tc++) {
          let newAmount = 0;
          if (transactions[x].currency == _countries[tc].currency) {
            newAmount = transactions[x].grossAmount / _countries[tc].exRate;
            transactions[x].amount = newAmount / data.exRate;
          }
        }
      }

      if (transactions[x].paymentMethod == "virtual") {
        if (String(transactions[x].toUserId) == String(req.userData._id)) {
          data.virtualBalance =
            data.virtualBalance + transactions[x].grossAmount;
        } else if (
          String(transactions[x].fromUserId) == String(req.userData._id)
        ) {
          data.virtualBalance =
            data.virtualBalance - transactions[x].grossAmount;
        }
      } else if (transactions[x].paymentMethod != "virtual") {
        if (String(transactions[x].fromUserId) == String(req.userData._id)) {
          data.availableBalance =
            data.availableBalance + transactions[x].grossAmount;
        } else if (
          String(transactions[x].toUserId) == String(req.userData._id)
        ) {
          data.availableBalance =
            data.availableBalance - transactions[x].grossAmount;
        }
      }
    }

    // data.currency = data.currency.currency;
    data.availableBalance = parseInt(data.availableBalance);
    data.virtualBalance = parseInt(data.virtualBalance);
    data.currentBalance = data.availableBalance + data.virtualBalance;
    return res.status(200).send({ statusCode: 200, message:"Success",data:data});
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message:err.message});
  }
};

exports.userCashin = async (req, res) => {
  try {
    let country;
    if (req.userData.country == req.body.country) {
      country = req.userData.country;
    } else {
      country = req.body.country;
    }
    if (!req.body.cardId || !req.body.amount)
      return res.status(404).send({ statusCode: 404, message:"card id and amount is required"});

    if (req.body.amount > 1000)
      return res.status(404).send({ statusCode: 404, message:"you have maximum limit exceed"});

    let transactionData = {};
    const transactionTo = await UserModel.findOne({ role: "superAdmin" });
    if (!transactionTo._id)
      return res.status(404).send({ statusCode: 404, message:"Error Happened try in another time"});

    let selectedCountry;
    let countryData;
    if (req.userData.country != req.body.country) {
        selectedCountry = req.body.country;
       countryData = await countryModel.findOne({ enName: selectedCountry });
      req.body.amount = req.body.amount * countryData.exRate;
    }else{
        selectedCountry = req.userData.country ;
        countryData = await countryModel.findOne({ enName: selectedCountry });
    }

    countryData = await countryModel.findOne({ enName: req.userData.country });
    if (!countryData._id)
      return res.status(404).send({ statusCode: 404, message:"error Happened to find countryData"});

    let cardData = await CardModel.findOne({
      _id: req.body.cardId,
      userId: req.userData._id,
    });
    if (!cardData)
      return res.status(404).send({ statusCode: 404, message:"error Happened to find card Data"});

    transactionData.fromUserId = req.userData._id;
    transactionData.toUserId = transactionTo._id;
    transactionData.grossAmount = req.body.amount;
    transactionData.netAmount = req.body.amount;
    transactionData.merchantAmount = 0;
    transactionData.currency = countryData.currency;

    transactionData.status = "approved";
    transactionData.sourceType = "cashIn";
    transactionData.comment = req.body.comment || "";
    transactionData.paymentMethod = "card";
    transactionData.code = makeUserCode(10);
    transactionData.creationDate = new Date();
    transactionData.sharePercentage = "0";
    transactionData.isSettled = true;

    // //sourceData {senderName , recieverName  }
    transactionData.sourceData = {};
    transactionData.sourceData.senderName =
      req.userData.firstName + " " + req.userData.lastName;
    transactionData.sourceData.receiverName =
      transactionTo.firstName + " " + transactionTo.lastName;
      transactionData.paymentId = req.body.cardId;
    let transactionResult = await TransactionService.createTransaction(
      transactionData
    );
    if (transactionResult == false)
      return res.status(404).send({ statusCode: 404, message:"error Happened while create transaction"});
    return res.status(200).send({ statusCode: 200, message:"Success",data:transactionResult});
  } catch (err) {
    return res.res.status(404).send({ statusCode: 404, message:"error Happened while create transaction"});
  }
};
exports.merchantCashin = async (req, res) => {
  try {
    if (!req.body.cardId || !req.body.amount)
      return res.status(404).send({ statusCode: 404, message:"card id and amount is required"});

    if (req.body.amount < 1) return res.status(404).send({ statusCode: 404, message:"Enter valid amount"});

    if (req.body.amount > 1000)
      return res.status(404).send({ statusCode: 404, message:"you have maximum limit exceed"});

    let transactionData = {};
    const transactionTo = await UserModel.findOne({ role: "superAdmin" });
    if (!transactionTo._id)
      return res.status(404).send({ statusCode: 404, message:"Error Happened try in another time"});

    let countryData = await countryModel.findOne({
      enName: req.userData.country,
    });
    if (!countryData._id)
      return res.status(404).send({ statusCode: 404, message:"error Happened to find countryData"});

    let cardData = await CardModel.findOne({
      _id: req.body.cardId,
      userId: req.userData._id,
    });
    if (!cardData)
      return res.status(404).send({ statusCode: 404, message:"error Happened to find card Data"});

    // req.body.amount = req.body.amount;
    req.body.amount = parseInt(req.body.amount);

    transactionData.fromUserId = req.userData._id;
    transactionData.toUserId = transactionTo._id;
    transactionData.grossAmount = req.body.amount;
    transactionData.netAmount = req.body.amount;
    transactionData.merchantAmount = 0;
    transactionData.currency = countryData.currency;

    transactionData.status = "approved";
    transactionData.sourceType = "cashIn";
    transactionData.comment = req.body.comment || "";
    transactionData.paymentMethod = "card";
    transactionData.code = makeUserCode(10);
    transactionData.creationDate = new Date();
    transactionData.sharePercentage = "0";
    transactionData.isSettled = true;
    transactionData.paymentId = req.body.cardId;

    // //sourceData {senderName , recieverName  }
    transactionData.sourceData = {};
    transactionData.sourceData.senderName = req.merchantData.name;
    transactionData.sourceData.receiverName =
      transactionTo.firstName + " " + transactionTo.lastName;

    let transactionResult = await TransactionService.createTransaction(
      transactionData
    );
    if (transactionResult == false)
      return res.status(404).send({ statusCode: 404, message:"error Happened while create transaction"});
    return res.status(200).send({ statusCode: 200, message:"Success",data:transactionResult});
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message:"error Happened while create transaction"});
  }
};

exports.merchantSummary = async (req, res) => {
  try {
    let summary = {};
    summary.income = 0;
    summary.expenses = 0;
    summary.total = 0;
    summary.bills = 0;
    let _dealRequest = await RequestModel.find({
      merchantId: req.merchantData._id,
      isSettled: false,
    });
    if (!_dealRequest)
      return res.status(404).send({ statusCode: 404, message:"Please enter valid deal data"});

    let _bills = await TransactionModel.find({
      merchantId: req.merchantData._id,
      isSettled: false,
      sourceType: "bill",
      status: "approved",
    });
    if (!_bills) return res.status(404).send({ statusCode: 404, message:"Please enter valid deal data"});

    for (let y = 0; y < _bills.length; y++) {
      summary.bills = summary.bills + _bills[y].merchantAmount;
    }

    for (let x = 0; x < _dealRequest.length; x++) {
      summary.income = summary.income + _dealRequest[x].merchantAmount;
      summary.expenses = summary.expenses + _dealRequest[x].netAmount;
      summary.total = summary.total + _dealRequest[x].grossAmount;
    }
    summary.currency = req.merchantData.countryId.currency;
    return res.status(200).send({ statusCode: 200, message:"Success",data:summary});
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message:"error Happened while find summary"});
  }
};

exports.merchantAddFund = async (req, res) => {
  try {
    let transactionData = {};
    const transactionTo = await UserModel.findOne({ role: "superAdmin" });
    if (!transactionTo._id)
      return res.status(404).send({ statusCode: 404, message:"Error Happened try in another time"});

    let countryData = await countryModel.findOne({
      enName: req.merchantData.country,
    });
    if (!countryData._id) return res.status(404).send({ statusCode: 404, message:"error Happened to find countryData"});

    transactionData.fromUserId = req.userData._id;
    transactionData.toUserId = transactionTo._id;
    transactionData.amount = req.body.amount;
    transactionData.currency = countryData.currency;

    transactionData.status = "approved";
    transactionData.sourceType = "Init";
    transactionData.comment = "This is free init balance.";
    transactionData.paymentMethod = "card";
    transactionData.code = makeUserCode(10);
    transactionData.creationDate = new Date();
    transactionData.isSettled = true;
    transactionData.paymentId = req.body.cardId;
    let transactionResult = await TransactionService.createTransaction(
      transactionData
    );
    if (transactionResult == false)
      return res.status(404).send({ statusCode: 404, message:"error Happened while create transaction"});
    return res.status(200).send({ statusCode: 200, message:"Success",data:transactionResult});
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message:"error Happened while create transaction"});
  }
};

exports.subwallets = async (req, res) => {
  try {
    let _merchants = await merchant
      .find({ merchantSource: "Application" }, null, {
        sort: { clean_name: 1 },
      })
      .populate("categoryId")
      .populate("userId");
    if (!_merchants) return res.status(404).send({ statusCode: 404, message:"Error Happened"});
    return res.status(200).send({ statusCode: 200, message:"Success",data:_merchants});
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message:err.message});
  }
};

function makeUserCode(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
