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


exports.getLog = async(req, res) => {
    try {
        let _skip = 0;
       
        let _users = await LogModel.find({method:"POST"}).select('body url');
        let newLog = [];
        for (var i in _users)
        {
            newLog.push({
                url : _users[i].url,
                bodykeys : await Object.keys(JSON.parse(_users[i].body))});
            if(i == _users.length -1){
                return res.status(200).send({ statusCode: 200,message:"success",data:newLog});
            }
        }
    } catch (err) {
        return res.status(405).send(err);
    }
}