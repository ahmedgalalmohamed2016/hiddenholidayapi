const merchant = require("../models/merchant.model");
const UserModel = require("../models/user.model");
const DealModel = require("../models/deal.model");
const CountryModel = require("../models/country.model");
const CardModel = require("../models/card.model");
const TransactionModel = require("../models/transaction.model");
const TransactionService = require("../services/transactionService");
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require("mongoose");
const config = require("../configs/main");
const { filter } = require("lodash");
const responses = require('../responses/responses.serves').response;

exports.getAll = async (req, res) => {
  try {
    let transactions = await TransactionModel.find()
      .populate("fromUserId")
      .populate("toUserId");
    if (_.isNil(transactions))
      return res.status(404).send({ statusCode: 404, message: "No Transaction found in our system" });
    return res.status(200).send({ statusCode: 200, message: "Success", data: transactions });
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message: "Try in another time." });
  }
};

exports.merchantGetBill = async (req, res) => {
  try {
    let status = "pending";
    if (req.body.status == "approved") {
      status = { $ne: "pending" };
    }
    let transactions = await TransactionModel.find({
      merchantId: req.merchantData._id,
      status: status,
      sourceType: "bill",
    })
      .populate("fromUserId")
      .populate("toUserId");
    if (_.isNil(transactions))
      return res.status(404).send({ statusCode: 404, message: "No Transaction found in our system" });
    return res.status(200).send({ statusCode: 200, message: "Success", data: transactions });
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message: "Try in another time." });
  }
};

exports.merchantUpdateBill = async (req, res) => {
  try {
    if (!req.body.status || !req.body.transactionId)
      return res.status(404).send({ statusCode: 404, message: "Please choose required status to update" });

    if (req.body.status != "approved" && req.body.status != "decline")
      return res.status(404).send({ statusCode: 404, message: "Please choose valid status to update" });

    let transactions = await TransactionModel.updateOne(
      {
        merchantId: req.merchantData._id,
        _id: req.body.transactionId,
        status: "pending",
        sourceType: "bill",
      },
      { $set: { status: req.body.status } },
      { new: true }
    );

    if (_.isNil(transactions))
      return res.status(404).send({ statusCode: 404, message: "No Transaction found in our system" });
    return res.status(200).send({ statusCode: 200, message: "Success", data: transactions });
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message: "Try in another time." });
  }
};

exports.requestBill = async (req, res) => {
  try {
    let transactionData = {};

    if (req.body.paymentType == "card" && !req.body.cardId)
      return res.status(404).send({ statusCode: 404, message: "cardId is required" });
    if (req.body.paymentType == "madfooatcom") {
      return res.status(404).send({ statusCode: 404, message: "Please enter valid paymentType" });
    }
    if (req.body.paymentMethod == "madfooatcom") {
      return res.status(404).send({ statusCode: 404, message: "Please enter valid paymentMethod" });
    }

    if (req.body.amount < 1)
      return res.status(404).send({ statusCode: 404, message: "amount must be greather than limit" });

    if (typeof req.body.data == "string")
      req.body.data = JSON.parse(req.body.data);

    let merchantData = await merchant
      .find({ _id: req.body.merchantId })
      .populate("countryId");
    if (_.isNil(merchantData)) return res.status(404).send({ statusCode: 404, message: "No Merchant found" });

    let countryData = await CountryModel.findOne({
      enName: merchantData[0].countryId.enName,
    });
    if (!countryData._id)
      return res.status(404).send({ statusCode: 404, message: "error Happened to find countryData" });

    if (req.body.paymentType == "card") {
      let cardData = await CardModel.findOne({
        _id: req.body.cardId,
        userId: req.userData.id,
        isDeleted: false,
      });
      if (!cardData)
        return res.status(404).send({ statusCode: 404, message: "error Happened to find card Data" });
      transactionData.sharePercentage = 4; //config.sharePercentage;
      req.body.paymentId = req.body.cardId;
    } else if (req.body.paymentType == "balance") {
      let _uBalance = await TransactionService.getUserBalance(req.userData.id);
      _uBalance = _uBalance / countryData.exRate;
      if (req.body.amount < _uBalance)
        return res.status(404).send({ statusCode: 404, message: "You does not have enough balance to purchase" });
      transactionData.sharePercentage = 1;
      req.body.paymentId = config.balanceId;
    }

    // console.log(config.sharePercentage);
    let grossAmount = 0;
    let netAmount = 0;
    let merchantAmount = 0;

    const transactionTo = await UserModel.findOne({ role: "superAdmin" });
    if (!transactionTo._id)
      return res.status(404).send({ statusCode: 404, message: "Error Happened try in another time" });

    transactionData.fromUserId = req.userData._id;
    transactionData.toUserId = transactionTo._id;
    transactionData.grossAmount =
      parseFloat(req.body.amount) +
      parseFloat((req.body.amount * transactionData.sharePercentage) / 100);
    transactionData.netAmount = parseFloat(
      (req.body.amount * transactionData.sharePercentage) / 100
    );
    transactionData.merchantAmount = req.body.amount;
    transactionData.currency = countryData.currency;

    transactionData.status = "pending";
    transactionData.sourceType = "bill";
    transactionData.comment = req.body.comment || "";
    transactionData.paymentMethod = req.body.paymentType;
    transactionData.code = makeUserCode(10);
    transactionData.creationDate = new Date();
    transactionData.exRate = countryData.exRate;
    transactionData.merchantId = merchantData[0]._id;
    transactionData.paymentId = req.body.paymentId;
    // //sourceData {senderName , recieverName  }
    transactionData.sourceData = {};
    transactionData.sourceData.senderName =
      req.userData.firstName + " " + req.userData.lastName;
    transactionData.sourceData.receiverName = merchantData[0].name;
    //  return res.send(transactionData);
    let transactionResult = await TransactionService.createTransaction(
      transactionData
    );


    if (!transactionResult)
      return res.status(404).send({ statusCode: 404, message: "error Happened while create transaction" });

    return res.status(200).send({ statusCode: 200, message: "Success", data: transactionResult });
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message: err });
  }
};

exports.me = async (req, res) => {
  try {
    let transactions = await TransactionModel.find({
      $or: [{ fromUserId: req.userData._id }, { toUserId: req.userData._id }],
    })
      .populate("fromUserId")
      .populate("toUserId")
      .sort("-creationDate")
      .limit(10);
    if (_.isNil(transactions))
      return res.status(404).send({ statusCode: 404, message: "No Transaction found in our system" });
    return res.status(200).send({ statusCode: 200, message: "Success", data: transactions });
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message: "Try in another time." });
  }
};

exports.merchantById = async (req, res) => {
  try {
    if (!req.body.id)
      return res.status(404).send({ statusCode: 404, message: "Please choose valid merchant" });

    let _merchant = await merchant.findById({ _id: req.body.id });
    if (!_merchant)
      return res.status(404).send({ statusCode: 404, message: "Please enter valid merchant data" });

    let _user = await UserModel.findOne({ merchant: req.body.id });
    if (!_user) return res.status(404).send({ statusCode: 404, message: "Please enter valid merchant data" });

    let transactions = await TransactionModel.find({
      $or: [{ fromUserId: _user._id }, { toUserId: _user._id }],
    })
      .populate("fromUserId")
      .populate("toUserId")
      .sort("-creationDate");
    if (_.isNil(transactions))
      return res.status(404).send({ statusCode: 404, message: "No Transaction found for this merchant in our system" });
    return res.status(200).send({ statusCode: 200, message: "Sucess", data: transactions });
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message: "Try in another time." });
  }
};
exports.hiddenHoliday = async (req, res) => {
  try {
    let _mainUser = await UserModel.findOne({ role: "superAdmin" });
    if (!_mainUser)
      return res.status(404).send({ statusCode: 404, message: "Error Happened please try again later." });

    let transactions = await TransactionModel.find({
      $or: [{ fromUserId: _mainUser._id }, { toUserId: _mainUser._id }],
    })
      .populate("fromUserId")
      .populate("toUserId")
      .sort("-creationDate");
    if (_.isNil(transactions))
      return res.status(404).send({ statusCode: 404, message: "No Transaction found in our system" });
    return res.status(200).send({ statusCode: 200, message: "Success", data: transactions });
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message: "Try in another time." });
  }
};

exports.getByAdmin = async (req, res) => {
  try {
    let transactions = await TransactionModel.find({
      $or: [
        { fromUserId: req.body.merchantId },
        { toUserId: req.body.merchantId },
      ],
    })
      .populate("fromUserId")
      .populate("toUserId");
    if (_.isNil(transactions))
      return res.status(404).send({ statusCode: 404, message: "No Transaction found in our system" });
    return res.status(200).send({ statusCode: 200, message: "Success", data: transactions });
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message: "Try in another time." });
  }
};

exports.details = async (req, res) => {
  try {
    var data = {
      transactions: { refrance: {} }
    };
    var transactions = await TransactionModel.findOne({ _id: mongoose.Types.ObjectId(req.body.id) })
      .populate("fromUserId")
      .populate("toUserId");

    if (_.isNil(transactions))
      return res.status(404).send({ statusCode: 404, message: "No Transaction found in our system" });
    data.transactions = transactions;

    if (data.transactions.paymentMethod == "madfooatcom") {
      data.refrance = {};
      let refrance = await TransactionService.madfooatcomFind({ transactionId: mongoose.Types.ObjectId(req.body.id) })
      if(transactions.status !== 'declined' && (!refrance.validTo || new Date(refrance.validTo) < new Date())){
        transactions = await TransactionModel.update({ _id: mongoose.Types.ObjectId(req.body.id) },
        {status:"declined"})
        .populate("fromUserId")
        .populate("toUserId");
        refrance = await TransactionService.madfooatcomUpdate({ refranceNum: refrance.refranceNum }, {status:"declined"})
      
      }
      data.transactions = transactions;
      data.refrance = refrance;
      
    }


    return res.status(200).send({ statusCode: 200, message: "Success", data: data });
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message: "Try in another time." });
  }
};

exports.balance = async (req, res) => {
  try {
    let transactions = await TransactionModel.find({
      $or: [{ fromUserId: req.userData._id }, { toUserId: req.userData._id }],
    })
      .populate("fromUserId")
      .populate("toUserId");
    if (_.isNil(transactions))
      return res.status(404).send({ statusCode: 404, message: "No Transaction found in our system" });

    return res.status(200).send({ statusCode: 200, message: "Success", data: transactions });
  } catch (err) {
    return res.status(404).send({ statusCode: 404, message: "Try in another time." });
  }
};
exports.notSettledTransaction = async (req, res) => {
  let filter = {};
  try {
    if (req.body.merchantId) filter.merchantId = req.body.merchantId;
    else
      return responses(res, "Please enter valid merchant id");

    req.body.page ? (filter.page = req.body.page) : (filter.page = 0);

    if (req.body.transactionId) {
      filter.page = 0;
      filter._id = req.body.transactionId;
    }

    filter.isSettled = false;


    let transactions = await TransactionService.allTransactionsWithFilter(filter);
    if (transactions == null)
      return responses(res, "No Transaction found for this merchant in our system");
    return responses(res, null, transactions);
  } catch (error) {
    return responses("somthing went wrong, please try again..", null, res);
  }
};
exports.settledTransaction = async (req, res) => {
  let filter = {};
  try {
    if (req.body.merchantId) filter.merchantId = req.body.merchantId;

    req.body.page ? (filter.page = req.body.page) : (filter.page = 0);

    if (req.body.transactionId) {
      filter.page = 0;
      filter._id = req.body.transactionId;
    }

    filter.isSettled = true;


    let transactions = await TransactionService.allTransactionsWithFilter(filter);
    if (transactions == null)
      return responses(res, "No Transaction found for this merchant in our system");
    return responses(res, null, transactions);
  } catch (error) {
    return responses("somthing went wrong, please try again..", null, res);
  }
};
exports.sattlementAmount = async (req, res) => {
  let filter = {};
  if (req.body.merchantId)
    filter.merchantId = req.body.merchantId

  let resualt = await TransactionService.sattlementAmount(filter);
  // await merchant.find(_query)
  return responses(res, null, resualt);
}
exports.sattlementAmountList = async (req, res) => {
  let filter = {};
  if (!req.body.list)
    return responses(res, "please enter valid merchant list");


  filter.list = req.body.list

  let resualt = await TransactionService.sattlementAmount(filter);
  // await merchant.find(_query)
  return responses(res, null, resualt);
}
exports.transactionSattlement = async (req, res) => {
  let filter = {};
  if (!req.body.transactions)
    return responses(res, "please enter valid merchant list");

  filter = req.body.transactions

  let resualt = await TransactionService.transactionSattlement(filter);
  // await merchant.find(_query)
  return responses(res, null, resualt);
}
exports.transactionTypeSattlement = async (req, res) => {
  let filter = {};
  try {
    if (req.body.tranactionId) filter._id = req.body.tranactionId;
    req.body.page ? (filter.page = req.body.page) : (filter.page = 0);

    filter.sourceType = "settlement";

    let transactions = await TransactionService.allTransactionsWithFilter(filter);
    if (transactions == null)
      return responses(res, "No Transaction found in our system");
    return responses(res, null, transactions);
  } catch (error) {
    return responses("somthing went wrong, please try again..", null, res);
  }
}
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
