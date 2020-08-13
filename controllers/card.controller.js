const merchant = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const DealModel = require('../models/deal.model');
const CardModel = require('../models/card.model');
const TransactionModel = require('../models/transaction.model');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');

exports.add = async(req, res) => {
    try {
        let data = req.body;
        // return res.send(req.body);
        var resl = data.cardNumber.length - 4;
        let first = data.cardNumber.substring(0, 5);
        let last = data.cardNumber.substring(resl, data.cardNumber.length);
        data.userId = req.userData._id;
        data.cardNumber = first + "****" + last;
        data.creationDate = new Date();
        let cardData = await CardModel.create(data);
        if (_.isNil(cardData))
            return res.send({statusCode:404,message:"Can not add this card."});
        return res.send({statusCode:200,message:"Success", data:cardData});

    } catch (err) {
        return res.send({statusCode:404,message:"Can not add this card."});
    }
}

exports.merchantAdd = async(req, res) => {
    try {
        let data = req.body;
        // return res.send(req.body);
        var resl = data.cardNumber.length - 4;
        let first = data.cardNumber.substring(0, 5);
        let last = data.cardNumber.substring(resl, data.cardNumber.length);
        data.userId = req.userData._id;
        data.cardNumber = first + "****" + last;
        data.creationDate = new Date();
        let cardData = await CardModel.create(data);
        if (_.isNil(cardData))
            return res.send({statusCode:404,message:"Can not add this card."});
        return res.send({statusCode:200,message:"Success", data:cardData});

    } catch (err) {
        return res.send({statusCode:404,message:"Can not add this card."});
    }
}

exports.cards = async(req, res) => {
    try {
        let cards = await CardModel.find({ userId: req.userData._id, isDeleted: false });
        if (_.isNil(cards))
            return res.send({statusCode:404,message:"No Cards found for this user"});
        return res.send({statusCode:200,message:"Success", data:cards});

    } catch (err) {
        return res.send({statusCode:404,message:"Try in another time."});
    }
}

exports.delete = async(req, res) => {
    try {
        if (_.isNil(req.body.id))
            return res.send({statusCode:404,message:"Card id is required."});

        let cards = await CardModel.updateOne({ _id: req.body.id, userId: req.userData._id }, { $set: { isDeleted: true } }, { new: true });

        if (_.isNil(cards))
            return res.send({statusCode:404,message:"Cannot remove this card."});
        return res.send({statusCode:200,message:"Success", data:cards});
    } catch (err) {
        return res.send({statusCode:404,message:"Cannot remove this card,Try in another time."});
    }
}