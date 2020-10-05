const merchant = require('../models/merchant.model');
const UserModel = require('../models/user.model');
const CountryModel = require('../models/country.model');
const CategoryModel = require('../models/categories.model');

const VerificationModel = require('../models/verification.model');
const passwordService = require('../services/passwordService');
const sendSmsService = require('../services/sendSmsService');
const tokenService = require('../services/tokenService');
const superagent = require('superagent');
const LogModel = require("../models/log.model");
const _ = require("lodash");
const request = require("superagent");
const fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const { filter } = require('lodash');


exports.getLog = async (req, res) => {
    let _skip = parseInt(req.body.pageNum);

    // let _users = await LogModel.find({method:"POST"}).select('body url');
    var _users = await LogModel.find({}).skip(_skip).limit(50);
    let count = await LogModel.count({});
    var newLog = [];
    try {
        for (var i in _users) {
            newLog.push({
                body : JSON.parse(_users[i].body),
                query : JSON.parse(_users[i].query),
                req : JSON.parse(_users[i].req),
                res : JSON.parse(_users[i].res),
                _id: _users[i]._id,
                reqId: _users[i].reqId,
                url: _users[i].url,
                query: _users[i].query,
                status: _users[i].status,
                fromIp:_users[i].fromIp,
                method: _users[i].method,
                createdAt: _users[i].createdAt,
                updatedAt: _users[i].updatedAt,
            })
        }
        return res.status(200).send({ statusCode: 200, message: "success", data: { pageNum: _skip,count: count, data: newLog } });

    } catch (err) {
        return res.status(405).send(err);
    }
   

}