const merchant = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const DealModel = require('../models/deal.model');
const CardModel = require('../models/card.model');
const transactionService = require('../services/transactionService');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');

exports.wellcom = async(req, res) => {
     return res.status(200).send({ statusCode: 200,message:"Wellcom Madfooatcom"});
}
exports.detail = async(req, res) => {
    console.log(req.body);
    let refranceData = await transactionService.madfooatcomFindDetail({refranceNum:req.body.refranceNum})
     return res.status(200).send({ statusCode: 200,message:"Wellcom Madfooatcom",data:refranceData});
}
