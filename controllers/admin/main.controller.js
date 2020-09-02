const MerchantModel = require('../../models/merchant.model');
const UserModel = require('../../models/user.model');
const CountryModel = require('../../models/country.model');
const PackageModel = require('../../models/package.model');
const TransactionModel = require('../../models/transaction.model');
const CategoriesModel = require('../../models/categories.model');
const DealModel = require('../../models/deal.model');
const VerificationModel = require('../../models/verification.model');
const passwordService = require('../../services/passwordService');
const sendSmsService = require('../../services/sendSmsService');
const tokenService = require('../../services/tokenService');
// const AirportModel = require('.././models/airport.model');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

exports.dashboard = async(req, res) => {
    try {
        let data = {};

        data.activeCountries = await CountryModel.count({ isActive: true });
        data.totalPackages = await PackageModel.count({});
        data.totalTransactions = await TransactionModel.count({});
        data.totalCategories = await CategoriesModel.count({});
        data.totalUsers = await UserModel.count({ role: 'user' });
        data.totalDeals = await DealModel.count({ type: 'deal' });
        data.totalBids = await DealModel.count({ type: 'bid' });

        data.totalActiveMerchants = await MerchantModel.count({ isActiveMerchant: true });
        data.totalNotActiveMerchants = await MerchantModel.count({ isActiveMerchant: false });

        return res.status(200).send({ statusCode: 200,message:"Success",data:data});
    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:err});
    }
};