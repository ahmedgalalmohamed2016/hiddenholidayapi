//User Token Contain : userDevice , userId , mobileNumber , userRole,randomDate;

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr'
const randomDate = new Date().getTime();
const secretKey = 'asjhut^tg*(2@EASFQ!_+"?]>,nvgfQMIZK#$,Zx[]iwQUsjJ~+-o+ujlcH^^%h(oWs';
const _ = require("lodash");
const TransactionModel = require('../models/transaction.model');
const RequestModel = require('../models/request.model');
module.exports = {
    createTransaction: function(transactionData) {
        const _transaction = TransactionModel.create(transactionData);
        if (_.isNil(_transaction))
            return false;
        return _transaction;
    },
    getTransaction: function(data) {

    },
    updateTransaction: function(userId) {

    },
    getUserBalance: async function(userId) {
        let cTransactions = await TransactionModel.find({ sourceType: "cashIn", fromUserId: userId }, 'netAmount grossAmount merchantAmount');
        let pTransactions = await TransactionModel.find({ sourceType: "purchase", paymentMethod: "balance", fromUserId: userId }, 'netAmount grossAmount merchantAmount');
        let nAmount = 0;
        let pAmount = 0;
        for (let i = 0; i < cTransactions.length; i++) {
            pAmount = pAmount + cTransactions[i].netAmount;
        }
        for (let x = 0; x < pTransactions.length; x++) {
            nAmount = nAmount + pTransactions[x].netAmount + pTransactions[x].merchantAmount;
        }
        let balance = pAmount - nAmount;
        return balance;
    },
    allTransactionsWithFilter: async (filter) =>{
        try {
            const page = filter.page;
            _skip =  page * 10;
            delete filter.page;
            console.log(filter);
            let transactions = await TransactionModel.find(filter).populate('fromUserId').populate('toUserId').sort('-creationDate').limit(10).skip(_skip);
            if (_.isNil(transactions) || transactions.length == 0)
                return null
            let transactionsCount = await TransactionModel.count(filter).populate('fromUserId').populate('toUserId').sort('-creationDate');
            return {"count":transactionsCount,"page":page,"transactions": transactions}
        
        } catch (error) {
            return error
        }
    }
}