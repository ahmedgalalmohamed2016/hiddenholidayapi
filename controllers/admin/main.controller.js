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
        data.totalDeals = await MerchantModel.count({ promotion: { $ne: null } });

        data.totalActiveMerchants = await MerchantModel.count({ isActiveMerchant: true });
        data.totalNotActiveMerchants = await MerchantModel.count({ isActiveMerchant: false });

        data.pendingDeals = await DealModel.count({ status: 'pending' });
        data.acceptedDeals = await DealModel.count({ status: 'accept' });
        data.declinedDeals = await DealModel.count({ status: 'decline' });

        return res.send(data);
    } catch (err) {
        return res.send(err);
    }
};