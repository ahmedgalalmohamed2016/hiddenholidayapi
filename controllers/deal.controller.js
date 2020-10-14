const MerchantModel = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const DealModel = require('../models/deal.model');
const CardModel = require('../models/card.model');
const CountryModel = require('../models/country.model');
const RequestModel = require('../models/request.model');
const CategoryModel = require('../models/categories.model');
const VerificationModel = require('../models/verification.model');
const passwordService = require('../services/passwordService');
const sendSmsService = require('../services/sendSmsService');
const tokenService = require('../services/tokenService');
const TransactionService = require('../services/transactionService');
const superagent = require('superagent');
const _ = require("lodash");
const request = require("superagent");
const fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const { config } = require('process');
const configration = require("../configs/main");



exports.adminCreateDeal = async(req, res) => {
    try {

        let _merchant = await MerchantModel.findById({ _id: req.body.id });
        if (!_merchant)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid merchant data"});

        let _category = await CategoryModel.findById({ _id: req.body.categoryId });
        if (!_category)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid category data"});

        let deal = {};
        deal.merchantId = req.body.id;
        deal.categoryId = _category._id;
        deal.countryId = _merchant.countryId;
        deal.title = req.body.title;
        deal.description = req.body.description;
        deal.country = _merchant.country;
        deal.currency = req.body.currency;
        deal.type = 'deal';
        deal.originalPrice = req.body.originalPrice;
        deal.newPrice = req.body.newPrice;
        deal.timeUsed = req.body.timeUsed;
        deal.discountPercentage = req.body.discountPercentage;
        deal.creationDate = new Date();
        deal.sharePercentage = req.body.sharePercentage;
        deal.titleAr = req.body.titleAr;
        deal.descriptionAr = req.body.descriptionAr;
        deal.maximumDays = req.body.maximumDays;
        deal.isActive = true;

        let dealData = await DealModel.create(deal);
        if (_.isNil(dealData))
            return res.status(404).send({ statusCode: 404,message:"Can not create this deal."});

        return res.status(200).send({ statusCode: 200,message:"Deal Created Success." });
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Please Try in another time",data:err});
    }
}
exports.merchantCreateDeal = async(req, res) => {
    try {

        let _category = await CategoryModel.findById({ _id: req.body.categoryId });
        if (!_category)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid category data"});

        let deal = {};
        deal.merchantId = req.merchantData._id;
        deal.categoryId = _category._id;
        deal.countryId = req.merchantData.countryId;
        deal.title = req.body.title;
        deal.description = req.body.description;
        deal.country = req.merchantData.country;
        deal.currency = req.body.currency;
        deal.type = 'deal';
        deal.originalPrice = req.body.originalPrice;
        deal.newPrice = req.body.newPrice;
        deal.timeUsed = req.body.timeUsed;
        deal.discountPercentage = req.body.discountPercentage;
        deal.creationDate = new Date();
        deal.sharePercentage = req.body.sharePercentage;
        deal.titleAr = req.body.titleAr;
        deal.descriptionAr = req.body.descriptionAr;
        deal.maximumDays = req.body.maximumDays;
        deal.isActive = true;

        let dealData = await DealModel.create(deal);
        if (_.isNil(dealData))
            return res.status(404).send({ statusCode: 404,message:"Can not create this deal."});

        return res.status(200).send({ statusCode: 200,message:"Deal Created Success."});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Please Try in another time", data:err});
    }
}

exports.merchantCreateBid = async(req, res) => {
    try {

        let _category = await CategoryModel.findById({ _id: req.body.categoryId });
        if (!_category)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid category data"});

        let deal = {};
        deal.merchantId = req.merchantData.id;
        deal.categoryId = _category._id;
        deal.countryId = req.merchantData.countryId;
        deal.title = req.body.title;
        deal.description = req.body.description;
        deal.country = req.merchantData.country;
        deal.currency = req.body.currency;
        deal.type = 'bid';
        deal.originalPrice = req.body.originalPrice;
        deal.newPrice = req.body.newPrice;
        deal.timeUsed = req.body.timeUsed;
        deal.discountPercentage = req.body.discountPercentage;
        deal.creationDate = new Date();
        deal.sharePercentage = req.body.sharePercentage;
        deal.titleAr = req.body.titleAr;
        deal.descriptionAr = req.body.descriptionAr;
        deal.maximumDays = req.body.maximumDays;
        deal.isActive = true;
        deal.startDate = new Date();
        var _date = new Date(); // Now
        _date.setDate(_date.getDate() + 30);
        deal.endDate = _date;


        let dealData = await DealModel.create(deal);
        if (_.isNil(dealData))
            return res.status(404).send({ statusCode: 404,message:"Can not create this bid."});

        return res.status(200).send({ statusCode: 200,message:"Bid Created Success."});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Please Try in another time" , data:err });
    }
}

exports.adminCreateBid = async(req, res) => {
    try {

        let _merchant = await MerchantModel.findById({ _id: req.body.id });
        if (!_merchant)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid merchant data"});

        let _category = await CategoryModel.findById({ _id: req.body.categoryId });
        if (!_category)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid category data"});

        let deal = {};
        deal.merchantId = req.body.id;
        deal.categoryId = _category._id;
        deal.countryId = _merchant.countryId;
        deal.title = req.body.title;
        deal.description = req.body.description;
        deal.country = _merchant.country;
        deal.currency = req.body.currency;
        deal.type = 'bid';
        deal.originalPrice = req.body.originalPrice;
        deal.newPrice = req.body.newPrice;
        deal.timeUsed = req.body.timeUsed;
        deal.discountPercentage = req.body.discountPercentage;
        deal.creationDate = new Date();
        deal.sharePercentage = req.body.sharePercentage;
        deal.titleAr = req.body.titleAr;
        deal.descriptionAr = req.body.descriptionAr;
        deal.maximumDays = req.body.maximumDays;
        deal.isActive = true;

        let dealData = await DealModel.create(deal);
        if (_.isNil(dealData))
            return res.status(404).send({ statusCode: 404,message:"Can not create this deal."});

        return res.status(200).send({ statusCode: 200,message:"Deal Created Success." });
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Please Try in another time",data: err});
    }
}

exports.deals = async(req, res) => {
    try {

        if (!req.query.country)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid country data"});
        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await DealModel.find({ isArchived: false, country: req.query.country, type: 'deal' }).populate('merchantId').populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));

        if (!dealsData)
            return res.status(404).send({ statusCode: 404,message:"Please enter data"});
        res.status(200).send({ statusCode: 200,message:"Success",data:dealsData});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error",data:err});
    }
}

exports.bids = async(req, res) => {
    try {

        if (!req.query.country)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid country data"});
        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await DealModel.find({ isArchived: false, country: req.query.country, type: 'bid' }).populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
        if (!dealsData)
            return res.status(404).send({ statusCode: 404,message:"Please enter data"});
        res.status(200).send({ statusCode: 200,message:dealsData});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error",err});
    }
}

exports.cart = async(req, res) => {
    try {
        if (!req.body.ids)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid cart id"});
        let ids = [];

        for (let x = 0; x < req.body.ids.length; x++) {
            let valu = new mongoose.Types.ObjectId(req.body.ids[x]);
            ids.push(valu);
        }
        let dealsData = await DealModel.find({
            _id: { $in: ids },
            isArchived: false
        }).populate('categoryId').orFail((err) => Error(err));
        if (!dealsData)
            return res.status(404).send({ statusCode: 404,message:"Please enter data"});
        res.status(200).send({ statusCode: 200,message:"Success",data:dealsData});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error",data:err});
    }
}

exports.MerchantDeals = async(req, res) => {
    try {
        if (!req.body.merchantId)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid merchant id"});

        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await DealModel.find({ merchantId: req.body.merchantId, type: 'deal' }).populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
        if (!dealsData)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid data"});
        return res.status(200).send({ statusCode: 200,message:"Success",data: dealsData});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error", data: err});
    }
}

exports.PublicMerchantDeals = async(req, res) => {
    try {
        if (!req.body.merchantId)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid merchant id"});

        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await DealModel.find({ merchantId: req.body.merchantId, type: 'deal' }).populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
        if (!dealsData)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid data"});
        return res.status(200).send({ statusCode: 200,message:"Success",data:dealsData});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error",data:err});
    }
}

exports.PublicMerchantBids = async(req, res) => {
    try {
        if (!req.body.merchantId)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid merchant id"});

        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await DealModel.find({ merchantId: req.body.merchantId, type: 'bid' }).populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
        if (!dealsData)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid data"});
        return res.status(200).send({ statusCode: 200,message:"Success",data:dealsData});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error",data:err});
    }
}


exports.MerchantBids = async(req, res) => {
    try {
        if (!req.body.merchantId)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid merchant id"});

        // get deals
        let _skip = 0;
        if (req.query.page)
            _skip = req.query.page * 10;
        let dealsData = await DealModel.find({ merchantId: req.body.merchantId, type: 'bid' }).populate('categoryId').limit(10).skip(_skip).orFail((err) => Error(err));
        if (!dealsData)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid data"});
        res.status(200).send({ statusCode: 200,message:"Success",data:dealsData});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error",data:err});
    }
}

exports.requestDeal = async(req, res) => {
    try {
        if (req.body.paymentType == "card" && !req.body.cardId)
            return res.status(401).send({ statusCode: 401,message:"cardId is required"});
        
            let _ids = [];

        if (typeof req.body.data == "string")
            req.body.data = JSON.parse(req.body.data);

        for (let x = 0; x < req.body.data.length; x++) {
            let valu = new mongoose.Types.ObjectId(req.body.data[x].id);
            _ids.push(valu);
        }
        let dealsData = await DealModel.find({
            _id: { $in: _ids },
            // isArchived: false,
            // isActive: false
        }).populate('categoryId').populate('countryId').populate('merchantId');
        // return res.send(dealsData);

        if (!dealsData)
            return res.status(401).send({ statusCode: 401,message:"error happened while find deals"});

        if (dealsData.length != req.body.data.length)
            return res.status(401).send({ statusCode: 401,message:"error happened while find deals that you choosen"});

        for (let y = 0; y < dealsData.length; y++) {
            if (dealsData[y].country != dealsData[0].country)
                return res.status(404).send({ statusCode: 404,message:"Deals must be at the same country"});
        }

        let countryData = await CountryModel.findOne({ enName: dealsData[0].country });
        if (!countryData._id)
            return res.status(401).send({ statusCode: 401,message:"error Happened to find countryData"});

        let totalGrossAmount = 0;
        let totalNetAmount = 0;
        let merchantAmount = 0;
        for (let y = 0; y < dealsData.length; y++) {
            if (dealsData[y].newPrice != 0) {
                totalGrossAmount = totalGrossAmount + dealsData[y].newPrice;
                totalNetAmount = totalNetAmount + (dealsData[y].newPrice * dealsData[y].sharePercentage / 100);
            } else if (dealsData[y].newPrice == 0) {
                totalGrossAmount = totalGrossAmount + dealsData[y].originalPrice;
                totalNetAmount = totalNetAmount + (dealsData[y].originalPrice * dealsData[y].sharePercentage / 100);
            }
        }

        let totalMerchantAmount = totalGrossAmount - totalNetAmount;

        if (req.body.paymentType == "card") {
            let cardData = await CardModel.findOne({ _id: req.body.cardId, userId: req.userData.id });
            req.body.paymentId = req.body.cardId
            if (!cardData)
                return res.status(401).send({ statusCode: 401,message:"error Happened to find card Data"});
        } else if (req.body.paymentType == "balance") {
            let _uBalance = await TransactionService.getUserBalance(req.userData.id);
            _uBalance = _uBalance / countryData.exRate;
            req.body.paymentId = configration.balance
            if (totalGrossAmount < _uBalance)
                return res.status(404).send({ statusCode: 404,message:"You does not have enough balance to purchase"});
        }else if(req.body.paymentMethod == "madfooatcom")
        {

        var refranceData = await TransactionService.madfooatcom();
          req.body.paymentId = refranceData._id
        }

        let transactionData = {};
        const transactionTo = await UserModel.findOne({ role: "superAdmin" });
        if (!transactionTo._id)
            return res.status(401).send({ statusCode: 401,message:"Error Happened try in another time"});
        transactionData.paymentId = req.body.paymentId;
        transactionData.fromUserId = req.userData._id;
        transactionData.toUserId = transactionTo._id;
        transactionData.grossAmount = totalGrossAmount;
        transactionData.netAmount = totalNetAmount;
        transactionData.merchantAmount = totalMerchantAmount;
        transactionData.currency = countryData.currency;

        transactionData.status = "pinding";
        transactionData.sourceType = "purchase";
        transactionData.comment = req.body.comment || "";
        transactionData.paymentMethod = req.body.paymentType;
        transactionData.code = makeUserCode(10);
        transactionData.creationDate = new Date();
        transactionData.sharePercentage = 'multi';
        transactionData.exRate = countryData.exRate;

        // //sourceData {senderName , recieverName  }
        transactionData.sourceData = {};
        transactionData.sourceData.senderName = req.userData.firstName + ' ' + req.userData.lastName;
        transactionData.sourceData.receiverName = transactionTo.firstName + ' ' + transactionTo.lastName;

        let transactionResult = await TransactionService.createTransaction(transactionData);
        if (!transactionResult)
            return res.status(401).send({ statusCode: 401,message:"error Happened while create transaction"});
        // create Deals Requests
        if(req.body.paymentMethod == "madfooatcom")
        {
          let updateMadfooatcom = await TransactionService.madfooatcomUpdate(
            {_id:req.body.paymentId },
            {transactionId:transactionResult._id});
  
          if(!updateMadfooatcom){
            let revertTransaction = await TransactionService.deleteTransaction(transactionData._id);
            return res.status(500).send({ statusCode: 500, message: "Error Happend, please try again" });
      
          }
        }

        // transactionSource: { type: String }, // if refund must insert source transaction id
        // bankAccount: { type: String },
        let requests = [];
        for (let z = 0; z < dealsData.length; z++) {
            let _requestData = {};
            _requestData._id = new mongoose.Types.ObjectId();
            _requestData.creationDate = new Date();
            _requestData.merchantId = dealsData[z].merchantId._id;
            _requestData.userId = req.userData._id;
            _requestData.transactionId = transactionResult._id;
            _requestData.dealId = dealsData[z]._id;
            _requestData.VerificationCode = makeUserCode(10);

            for (let r = 0; r < req.body.data.length; r++) {
                if (req.body.data[r].id == dealsData[z]._id) {
                    _requestData.count = req.body.data[r].count;
                    if (req.body.data[r].isDelivery == true && dealsData[z].isDelivery == true) {
                        _requestData.deliveryRequested = true;
                        _requestData.deliveryStatus = 'request';
                        _requestData.deliveryAddress = req.userData.address;
                        _requestData.deliveryMobileNumber = req.userData.username;
                        _requestData.deliveryName = req.userData.firstName + req.userData.lastName;
                        _requestData.deliveryTime = dealsData[z].deliveryTime;
                        _requestData.deliveryFees = dealsData[z].deliveryFees;
                    }
                }
            }
            _requestData.title = dealsData[z].title;
            _requestData.description = dealsData[z].description;
            _requestData.arTitle = dealsData[z].arTitle;
            _requestData.arDescription = dealsData[z].arDescription;
            _requestData.type = dealsData[z].type;

            _requestData.country = dealsData[z].country;
            _requestData.maximumDays = dealsData[z].maximumDays;
            _requestData.timeUsed = dealsData[z].timeUsed;

            if (dealsData[z].newPrice == 0) {
                _requestData.grossAmount = dealsData[z].originalPrice;
                _requestData.netAmount = dealsData[z].originalPrice * dealsData[z].sharePercentage / 100;
                _requestData.merchantAmount = _requestData.grossAmount - _requestData.netAmount;
            } else {
                _requestData.grossAmount = dealsData[z].newPrice;
                _requestData.netAmount = dealsData[z].newPrice * dealsData[z].sharePercentage / 100;
                _requestData.merchantAmount = _requestData.grossAmount - _requestData.netAmount;
            }
            _requestData.sharePercentage = dealsData[z].sharePercentage;
            _requestData.status = "pending";
            _requestData.categoryId = dealsData[z].categoryId._id;
            requests.push(_requestData);
        }

        let requestData = RequestModel.create(requests);

        if (!requestData)
            return res.status(401).send({ statusCode: 401,message:"error Happened while create requests"});
        return res.status(200).send({ statusCode: 200,message:"Requests Created Success",data:{refNum: refranceData.refranceNum ? refranceData.refranceNum : false}});

    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Errror",data: err});
    }
}


exports.DealData = async(req, res) => {
    try {
        if (!req.body.id)
            res.status(404).send({ statusCode: 404,message:"please enter valid data"});

        let _deal = await DealModel.findById({ _id: req.body.id, isArchived: false })
            .populate('categoryId');

        if (!_deal)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid deal data"});
        return res.status(200).send({ statusCode: 200,message:"Success",data:_deal});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
    }
}

exports.MerchantDealData = async(req, res) => {
    try {
        if (!req.body.id)
            res.status(404).send({ statusCode: 404,message:"please enter valid data"});

        let _deal = await DealModel.find({ _id: req.body.id, merchantId: req.merchantData._id }).populate('categoryId');
        if (!_deal)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid deal data"});

        let _dealRequest = await RequestModel.count({ merchantId: req.merchantData._id, dealId: req.body.id });

        if (_dealRequest < 0)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid deal data"});
        return res.status(200).send({ statusCode: 200,message:"Success",data:{ deal: _deal, totalRequests: _dealRequest }});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
    }
}

exports.RequestData = async(req, res) => {
    try {
        if (!req.body.id)
            res.status(404).send({ statusCode: 404,message:"please enter valid data"});

        let _request = await RequestModel.findById({ _id: req.body.id }).populate('userId').populate('transactionId').populate('dealId');
        if (!_request)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid request data"});
        return res.status(200).send({ statusCode: 200,message:"Success",data: _request});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
    }
}
exports.useDeal = async(req, res) => {
    try {
        if (!req.body.id)
            res.status(404).send({ statusCode: 404,message:"please enter valid data"});

        let _request = await RequestModel.findById({ _id: req.body.id }).populate('userId').populate('transactionId').populate('dealId');
        
        if (!_request)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid request data"});
            if(_request.count == 0)
            return res.status(404).send({ statusCode: 404,message:"You alredy used the deal"});

            _request.count = _request.count - 1;
            _request.timeUsed = "" + _request.count;
            _request.isUsed = true;
             await RequestModel.updateOne({ _id: req.body.id },_request).populate('userId').populate('transactionId').populate('dealId');
             let _requestAfterUpdate = await RequestModel.findById({ _id: req.body.id }).populate('userId').populate('transactionId').populate('dealId');
             return res.status(200).send({ statusCode: 200,message:"Success",data:_requestAfterUpdate});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
    }
}

exports.AdminDealData = async(req, res) => {
    try {
        if (!req.body.id)
            res.status(404).send({ statusCode: 404,message:"please enter valid data"});

        let _deal = await DealModel.findById({ _id: req.body.id, isArchived: false });


        if (!_deal)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid deal data"});
        return res.status(200).send({ statusCode: 200,message:"Success",data:_deal});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
    }
}

exports.MerchantDeals = async(req, res) => {
    try {

        let _req = {};
        _req.merchantId = req.merchantData._id;
        if (req.body.isArchived && req.body.isArchived == true) {
            _req.isArchived = true;
        } else {
            _req.isArchived = false;
        }

        if (req.body.type == 'bid') {
            _req.type = 'bid';
        } else {
            _req.type = 'deal';
        }
        let _deal = await DealModel.find(_req).populate('categoryId');
        if (!_deal)
            return res.status(404).send({ statusCode: 404,message:"Please enter valid deal data"});
        return res.status(200).send({ statusCode: 200,message:"Success",data:_deal});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
    }
}

exports.ActiveDealRequests = async(req, res) => {
    try {
        let _query = {};
        _query.merchantId = req.merchantData._id;
        _query.isSettled = false;
        _query.isRefunded = false;
        let pageNumber;

        if (req.body.type) {
            if (req.body.type != "deal" && req.body.type != "bid")
                return res.status(404).send({ statusCode: 404,message:"Please enter valid deals type"});
            _query.type = req.body.type;
        }
        if (req.body.page) {
            pageNumber = parseInt(req.body.page) * 10;
        } else {
            pageNumber = 0;
        }

        _query.deliveryRequested = false;

        let _checkDeal = await RequestModel.find(_query).sort('-creationDate').skip(pageNumber).limit(10).populate('userId').populate('transactionId');

        if (!_checkDeal)
            return res.status(200).send({ statusCode: 200,message:"Success",data:[]});
        return res.status(200).send({ statusCode: 200,message:"Success",data:_checkDeal})
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
    }
}

exports.ActiveDealRequestsDelivery = async(req, res) => {
    try {
        let _query = {};
        _query.merchantId = req.merchantData._id;
        _query.isSettled = false;
        _query.isRefunded = false;
        let pageNumber;

        if (req.body.type) {
            if (req.body.type != "deal" && req.body.type != "bid")
                return res.status(404).send({ statusCode: 404,message:"Please enter valid deals type"});
            _query.type = req.body.type;
        }
        if (req.body.page) {
            pageNumber = parseInt(req.body.page) * 10;
        } else {
            pageNumber = 0;
        }

        _query.deliveryRequested = true;

        let _checkDeal = await RequestModel.find(_query).sort('-creationDate').skip(pageNumber).limit(10).populate('userId').populate('transactionId');
        if (!_checkDeal)
            return res.status(200).send({ statusCode: 200,message:"Success",data:[]});
        return res.status(200).send({ statusCode: 200,message:"Success",data:_checkDeal})
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
    }
}

exports.UserDealRequests = async(req, res) => {
    try {
        let _query = {};
        let pageNumber;
        _query.userId = req.userData._id;
        _query.isSettled = false;

        if (req.body.type) {
            if (req.body.type != "deal" && req.body.type != "bid")
                return res.status(404).send({ statusCode: 404,message:"Please enter valid deals type"});
            _query.type = req.body.type;
        }

        if (req.body.isUsed) {
            _query.isUsed = req.body.isUsed;
        }
        if (req.body.dealId) {
            _query._id = req.body.dealId;
        }
        if (req.body.page) {
            pageNumber = parseInt(req.body.page) * 10;
        } else {
            pageNumber = 0;
        }
        let _checkDeal = await RequestModel.find(_query)
        .populate('transactionId').populate('categoryId')
        .populate('dealId')
        .populate('merchantId')
        .sort('-creationDate').skip(pageNumber).limit(10).populate('userId')
        if (!_checkDeal)
            return res.status(404).send({ statusCode: 404,message:"We doesnot found any deals"});
        return res.status(200).send({ statusCode: 200,message:"Success",data:_checkDeal});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
    }
}
exports.UserDealRequestsUser = async(req, res) => {
    try {
        let _query = {};
        let pageNumber;
        _query.userId = req.userData._id;
        _query.isSettled = false;

        if (req.body.type) {
            if (req.body.type != "deal" && req.body.type != "bid" && req.body.type != "any")
                return res.status(404).send({ statusCode: 404,message:"Please enter valid deals type"});
                if(req.body.type != "any")
            _query.type = req.body.type;
        }

        if (req.body.isUsed) {
            _query.isUsed = req.body.isUsed;
        }
        if (req.body.dealId) {
            _query._id = req.body.dealId;
        }
        if (req.body.page) {
            pageNumber = parseInt(req.body.page) * 10;
        } else {
            pageNumber = 0;
        }
        let _checkDeal = await RequestModel.find(_query)
        .populate('transactionId').populate('categoryId')
        .populate('dealId')
        .populate('merchantId')
        .sort('-creationDate').skip(pageNumber).limit(10).populate('userId')
        if (!_checkDeal)
            return res.status(404).send({ statusCode: 404,message:"We doesnot found any deals"});
        return res.status(200).send({ statusCode: 200,message:"Success",data:_checkDeal});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
    }
}


exports.history = async(req, res) => {
    try {
        let _checkDeal = await DealModel.find({ userId: req.userData._id }).populate('merchants');
        if (_checkDeal)
            return res.status(200).send({ statusCode: 200,message:"Success",data:_checkDeal});
        return res.status(200).send({ statusCode: 200,message:"Success",data:{}});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:"Error Happened"});
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