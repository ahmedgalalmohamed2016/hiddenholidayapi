const merchant = require('../models/merchant.model');
const country = require('../models/country.model');

const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

exports.create = async (req, res) => {
    try {
        let data = {};
        data.enName = req.body.enName;
        data.arName = req.body.arName;
        data.code = req.body.code;
        data.isActive = req.body.isActive;
        data.initBalance = req.body.initBalance || [{}];

        let countryData = await country.find({
            $or: [{ enName: data.enName }, { arName: data.arName }, { code: data.code }]
        });
        if (!_.isNil(countryData) && countryData.length > 0)
            return res.status(403).send("Country Added before,try another name");
        let c = await country.create(data);

        return res.send(c);
    } catch (err) {
        return res.send(err.message);
    }
};

exports.getCountries = async (req, res) => {
    try {
        let rawdata = fs.readFileSync('./json/countries.json');
        let _cresult = JSON.parse(rawdata);

        let x = _cresult.sort((a, b) => (a.name > b.name) ? 1 : -1)
        return res.send(x);
    } catch (err) {
        return res.send({ data: "Try in another time." });
    }
}