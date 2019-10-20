//User Token Contain : userDevice , userId , mobileNumber , userRole,randomDate;

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr'
const randomDate = new Date().getTime();
const secretKey = 'asjhut^tg*(2@EASFQ!_+"?]>,nvgfQMIZK#$,Zx[]iwQUsjJ~+-o+ujlcH^^%h(oWs';
const TransactionModel = require('../models/transaction.model');

module.exports = {
    createTransaction: function (data) {

    },
    getTransaction: function (data) {

    },
    updateTransaction: function (data) {

    }
}