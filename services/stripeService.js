const stripe = require('stripe')('sk_test_dIUPrOK0EGRC8cHE7rI9Zugd00tr31g3Sq');
const async = require('async');
// const handelRes = require('../config/handelRes').handelRes;
const stripe = require('stripe')('sk_test_dIUPrOK0EGRC8cHE7rI9Zugd00tr31g3Sq');

exports.createUser = function(reqData, callback) {
    var resultData = {};
    async.series([
        function(cb) {
            stripe.customers.create(reqData,
                function(err, res) {
                    if (err || !res)
                        return cb(err || "cannot create stripr custumer");
                    resultData.custumerData = res;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        if (err)
            return callback(err);
        var output = resultData.custumerData;
        return callback(null, output);
    })
}
exports.listCustomers = function(reqData, callback) {
    var resultData = {};
    async.series([
        function(cb) {
            var listOject = {
                limit: 10,
            }
            reqData.starting_after ? listOject.starting_after = reqData.starting_after : false;
            stripe.customers.list(listOject,
                function(err, customers) {
                    if (err || !res)
                        return cb(err || "cannot create stripr custumer");
                    resultData.custumerData = customers;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        if (err)
            return callback(err);
        // var output = handelRes(200, "sucess", resultData.merchantData);
        return callback(null, resultData.merchantData);
    })
}
exports.retrieveCustomer = function(customerId, callback) {
    var resultData = {};
    async.series([
        function(cb) {
            stripe.customers.retrieve(customerId,
                function(err, customers) {
                    if (err || !res)
                        return cb(err || "cannot create stripr custumer");
                    resultData.custumerData = customers;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        if (err)
            return callback(err);
        // var output = handelRes(200, "sucess", resultData.merchantData);
        return callback(null, resultData.merchantData);
    })
}
exports.updateCustomer = function(customerId, data, callback) {
    var resultData = {};
    async.series([
        function(cb) {
            stripe.customers.update(customerId, data,
                function(err, customers) {
                    if (err || !res)
                        return cb(err || "cannot create stripr custumer");
                    resultData.custumerData = customers;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        if (err)
            return callback(err);
        // var output = handelRes(200, "sucess", resultData.merchantData);
        return callback(null, resultData.merchantData);
    })
}
exports.deleteCustomer = function(customerId, callback) {
    var resultData = {};
    async.series([
        function(cb) {
            stripe.customers.del(customerId,
                function(err, customers) {
                    if (err || !res)
                        return cb(err || "cannot create stripr custumer");
                    resultData.custumerData = customers;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        if (err)
            return callback(err);
        // var output = handelRes(200, "sucess", resultData.merchantData);
        return callback(null, resultData.merchantData);
    })
}
exports.createCard = function(req, callback) {
    var resultData = {};
    resultData.customerId = req.body.customerId;
    resultData.cardData = {
        exp_month: req.body.expMonth,
        exp_year: req.body.expYear,
        number: req.body.cardNum,
        cvc: req.body.cvc
    }
    async.series([
        function(cb) {
            stripe.tokens.create({
                card: cardData
            }, function(err, token) {
                if (err || !token)
                    return cb(err || "error, please try again.")
                resultData.token = token;
                return cb(null);
            });
        },
        function(cb) {
            stripe.customers.createSource(customerId, {
                    source: resultData.token.id
                },
                function(err, card) {
                    if (err || !card)
                        return cb(err || "cannot create stripe custumer");
                    resultData = card;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        //     return res.send(err)
        // return res.send(resultData);
        if (err)
            return callback(err);
        return callback(null, resultData);
    })
}
exports.listAllCards = function(reqData, callback) {
    var resultData = {};
    async.series([
        function(cb) {
            var listOject = {
                limit: 10,
                object: 'card'
            }
            reqData.starting_after ? listOject.starting_after = reqData.starting_after : false;
            stripe.customers.listSources(
                req.body.customerId,
                listOject,
                function(err, cards) {
                    if (err || !cards)
                        return cb(err || "cannot get card list from stripe, please try again.");
                    resultData.cardList = cards;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        if (err)
        //     return res.send(err)
        // return res.send(resultData);
            return callback(err);
        return callback(null, resultData.cardList);
    })
}
exports.deleteCard = function(reqData, callback) {
    var resultData = {};
    async.series([
        function(cb) {
            stripe.customers.deleteSource(
                reqData.customerId,
                reqData.cardId,
                function(err, confirmation) {
                    if (err || !confirmation)
                        return cb(err || "cannot delete card, please try again.")
                    resultData.confirmation = confirmation;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        if (err)
        //     return res.send(err)
        // return res.send(resultData);
            return callback(err);
        return callback(null, resultData.confirmation);
    })
}
exports.updateCard = function(reqData, callback) {
    var resultData = {};
    async.series([
        function(cb) {
            stripe.customers.updateSource(
                reqData.customerId,
                reqData.cardId,
                reqData.cardData,
                function(err, card) {
                    if (err || !card)
                        return cb(err || "cannot update card data, please try again.")
                    resultData.card = card;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        if (err)
        //     return res.send(err)
        // return res.send(resultData);
            return callback(err);
        return callback(null, resultData.card);
    })
}
exports.retrieveCard = function(reqData, callback) {
    var resultData = {};
    async.series([
        function(cb) {
            stripe.customers.retrieveSource(
                reqData.customerId,
                reqData.cardId,
                function(err, card) {
                    if (err || !card)
                        return cb(err || "cannot update card data, please try again.")
                    resultData.card = card;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        if (err)
        //     return res.send(err)
        // return res.send(resultData);
            return callback(err);
        return callback(null, resultData.card);
    })
}
exports.createTransaction = function(reqData, callback) {
    var resultData = {};
    async.series([
        function(cb) {
            stripe.paymentIntents.create({
                    customer: reqData.customerId,
                    source: reqData.cardId,
                    payment_method_types: ['card'],
                    currency: reqData.currency,
                    amount: reqData.amount,
                    confirm: true
                },
                function(err, transaction) {
                    if (err || !transaction)
                        return cb(err || "cannot create transaction, please try again.")
                    resultData.transaction = transaction;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        if (err)
        //     return res.send(err)
        // return res.send(resultData);
            return callback(err);
        return callback(null, resultData.transaction);
    })
}
exports.getTransaction = function(reqData, callback) {
    var resultData = {};
    async.series([
        function(cb) {
            stripe.paymentIntents.retrieve(reqData.transactionId,
                function(err, transaction) {
                    if (err || !transaction)
                        return cb(err || "cannot create transaction, please try again.")
                    resultData.transaction = transaction;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        if (err)
        //     return res.send(err)
        // return res.send(resultData);
            return callback(err);
        return callback(null, resultData.transaction);
    })
}
exports.getAllTransactions = function(reqData, callback) {
    var resultData = {};
    async.series([
        function(cb) {
            var listOject = {
                limit: 10,
                customer: reqData.customerId
            }
            reqData.starting_after ? listOject.starting_after = reqData.starting_after : false;
            stripe.paymentIntents.retrieve(listOject,
                function(err, transactions) {
                    if (err || !transactions)
                        return cb(err || "cannot create transaction, please try again.")
                    resultData.transactions = transactions;
                    return cb(null);
                }
            );
        }
    ], function(err) {
        if (err)
        //     return res.send(err)
        // return res.send(resultData);
            return callback(err);
        return callback(null, resultData.transactions);
    })
}