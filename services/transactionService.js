//User Token Contain : userDevice , userId , mobileNumber , userRole,randomDate;

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr'
const randomDate = new Date().getTime();
const secretKey = 'asjhut^tg*(2@EASFQ!_+"?]>,nvgfQMIZK#$,Zx[]iwQUsjJ~+-o+ujlcH^^%h(oWs';
const _ = require("lodash");
const TransactionModel = require('../models/transaction.model');

module.exports = {
    createTransaction: function(transactionData) {
        const _transaction = TransactionModel.create(transactionData);
        if (_.isNil(_transaction))
            return false;
        return _transaction;
    },
    getTransaction: function(data) {

    },
    updateTransaction: function(data) {

    }
}