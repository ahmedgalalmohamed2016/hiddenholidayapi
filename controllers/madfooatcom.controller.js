const merchant = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const DealModel = require('../models/deal.model');
const CardModel = require('../models/card.model');
const transactionService = require('../services/transactionService');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');

exports.wellcom = async (req, res) => {
     return res.status(200).send({ statusCode: 200, message: "Wellcom Madfooatcom" });
}
exports.detail = async (req, res) => {
     let refranceData = await transactionService.madfooatcomFindDetail({ refranceNum: req.body.refranceNum })
     return res.status(200).send({ statusCode: 200, message: "Wellcom Madfooatcom", data: refranceData });
}
exports.status = async (req, res) => {
     updateData = {};
     if (req.body.status == '1')
          updateData = { status: 'accepted' };
     else if (req.body.status == '0')
          updateData = { status: 'rejected' };
     let refranceData = await transactionService.madfooatcomchangeStatus({ refranceNum: req.body.refranceNum }, updateData)
     if(!refranceData)
     return res.status(404).send({ statusCode: 404, message: "This Transaction is not avalable"});

     return res.status(200).send({ statusCode: 200, message: "Wellcom Madfooatcom", data: refranceData });
}
