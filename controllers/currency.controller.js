const merchant = require('../models/merchant.model');
const currency = require('../models/currency.model');

const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

exports.create = async (req, res) => {
    try {
        let data = {};


        return res.send(c);
    } catch (err) {
        return res.send(err.message);
    }
};

exports.update = async (req, res) => {
    try {
        let data = {};

        if (!_.isNil(countryData) && countryData.length > 0)
            return res.status(403).send("currency Added before,try another name");
        let c = await currency.create(data);

        return res.send(c);
    } catch (err) {
        return res.send(err.message);
    }
};

exports.getCurrencies = async (req, res) => {
    try {
        let rawdata = fs.readFileSync('./json/countries.json');
        let _cresult = JSON.parse(rawdata);

        return res.send(_cresult);
    } catch (err) {
        console.log(err);
        return res.send({ data: "Try in another time." });
    }
}

function getKeyByValue(object, value) { 
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) { 
                    if (prop === value) 
                    return object[prop]; 
                } 
            } 
        }