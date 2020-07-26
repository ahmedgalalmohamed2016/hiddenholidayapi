//User Token Contain : userDevice , userId , mobileNumber , userRole,randomDate;

const crypto = require("crypto"),
    algorithm = "aes-256-ctr";
const randomDate = new Date().getTime();
const secretKey =
    'asjhut^tg*(2@EASFQ!_+"?]>,nvgfQMIZK#$,Zx[]iwQUsjJ~+-o+ujlcH^^%h(oWs';
const _ = require("lodash");
const TransactionModel = require("../models/transaction.model");
const RequestModel = require("../models/request.model");
const merchant = require("../models/merchant.model");
const BankAcountModel = require("../models/bankAccount.model");
const mongoose = require("mongoose");
module.exports = {
    createTransaction: function (transactionData) {
        const _transaction = TransactionModel.create(transactionData);
        if (_.isNil(_transaction)) return false;
        return _transaction;
    },
    getTransaction: function (data) { },
    updateTransaction: function (userId) { },
    getUserBalance: async function (userId) {
        let cTransactions = await TransactionModel.find(
            { sourceType: "cashIn", fromUserId: userId },
            "netAmount grossAmount merchantAmount"
        );
        let pTransactions = await TransactionModel.find(
            { sourceType: "purchase", paymentMethod: "balance", fromUserId: userId },
            "netAmount grossAmount merchantAmount"
        );
        let nAmount = 0;
        let pAmount = 0;
        for (let i = 0; i < cTransactions.length; i++) {
            pAmount = pAmount + cTransactions[i].netAmount;
        }
        for (let x = 0; x < pTransactions.length; x++) {
            nAmount =
                nAmount + pTransactions[x].netAmount + pTransactions[x].merchantAmount;
        }
        let balance = pAmount - nAmount;
        return balance;
    },
    allTransactionsWithFilter: async (filter) => {
        try {
            const page = filter.page;
            _skip = page * 10;
            delete filter.page;
            let transactions = await TransactionModel.find(filter)
                .populate("fromUserId")
                .populate("toUserId")
                .sort("-creationDate")
                .limit(10)
                .skip(_skip);
            if (_.isNil(transactions) || transactions.length == 0) return null;
            let transactionsCount = await TransactionModel.count(filter)
                .populate("fromUserId")
                .populate("toUserId")
                .sort("-creationDate");
            return {
                count: transactionsCount,
                page: page,
                transactions: transactions,
            };
        } catch (error) {
            return error;
        }
    },
    sattlementAmount: async (filter) => {
        filter.isSettled = false;
        if (!filter.merchantId && !filter.list) filter.merchantId = { $ne: null };
        if (filter.list)
            try {
                let ids = JSON.parse(filter.list);
                for (var i in ids) ids[i] = mongoose.Types.ObjectId(ids[i]);

                filter.merchantId = { $in: ids };
            } catch (err) {
                console.log(err);
            }

        let resultData = {
            data: [],
            merchantsIds: [],
        };
        delete filter.list;
        const merchants = await TransactionModel.aggregate([
            {
                $match: filter,
            },
            {
                $group: {
                    _id: {
                        merchantId: "$merchantId",
                        currency: "$currency",
                    },
                    merchantAmount: { $sum: "$merchantAmount" },
                },
            },
        ]);

        for (var i in merchants) {
            resultData.data.push({
                merchantId: merchants[i]._id.merchantId,
                merchantAmount: merchants[i].merchantAmount,
                currency: merchants[i]._id.currency,
            });
            resultData.merchantsIds.push(merchants[i]._id.merchantId);
        }
        return resultData.data;
    },
    transactionSattlement: async (transactions) => {
        try {
            let ids = JSON.parse(transactions);
            for (var i in ids) ids[i] = mongoose.Types.ObjectId(ids[i]);

            let allMerchants = [];
            const allData = await TransactionModel.aggregate([
                {
                    $match: { _id: { $in: ids }, isSettled: false, merchantId: { $ne: null } },
                },
                {
                    $group: {
                        _id: {
                            merchantId: "$merchantId",
                        },
                    },
                },
            ]);

            for (let i in allData) {
                allMerchants.push(mongoose.Types.ObjectId(allData[i]._id.merchantId));
            }

            const banckAcounts = await BankAcountModel.find({
                isDefault: true,
                merchantId: { $in: allMerchants },
            });

            const notSetDefault = [];
            const haveDefault = [];
            for (let ind in allMerchants) {
                banckAcounts.map(async (elm) => {
                    if (elm.merchantId == allMerchants[ind].toString()) {
                        notSetDefault.push(mongoose.Types.ObjectId(elm.merchantId));
                    } else {
                        const totalAmount = await TransactionModel.aggregate([
                            {
                                $match: {
                                    merchantId: elm.merchantId,
                                    isSettled: false
                                },
                            },
                            {
                                $group: {
                                    _id: {
                                        merchantId: "$merchantId",
                                        currency: "$currency",
                                        fromUserId:"$fromUserId"
                                    },
                                    merchantAmount: { $sum: "$merchantAmount" },
                                    netAmount: { $sum: "$netAmount" },
                                    grossAmount: { $sum: "$grossAmount" },
                                },
                            },
                        ]);
                        const updateTransaction = await TransactionModel.updateMany({
                            merchantId: elm.merchantId,
                            isSettled: false
                        }, {
                            isSettled: true,
                            satteledAccount: elm._id
                        });
                        if (_.isNil(updateTransaction))
                            return res.send("error Happened while create user account");

                        const data = {
                            isActive: true,
                            isSettled: true,
                            isRefunded: false,
                            fromUserId: totalAmount[0]._id.fromUserId,
                            toUserId: totalAmount[0]._id.merchantId,
                            grossAmount: totalAmount[0].grossAmount,
                            netAmount: totalAmount[0].netAmount,
                            merchantAmount: totalAmount[0].merchantAmount,
                            currency: totalAmount[0]._id.currency,
                            status: 'pending',
                            sourceType: 'settlement',
                            comment: '',
                            merchantId: totalAmount[0]._id.merchantId,
                            paymentMethod: "settlement",
                            isSettled: true,
                            satteledAccount: elm._id
                        }
                        const creation = await TransactionModel.create(data);
                        console.log(creation);
                    }
                })
            }

            if (notSetDefault.length > 0)
                return res.send({
                    message: "this merchants cannot settled, must set default banck account ",
                    merchantIds: notSetDefault
                })
            else
                return {};
        } catch (err) {
            return err;
        }
    },
};
