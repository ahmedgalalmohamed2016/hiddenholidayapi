const merchant = require('../models/merchant.model');
const country = require('../models/country.model');
const superagent = require('superagent');
const tokenService = require('../services/tokenService');

const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');



exports.getCountries = async(req, res) => {
    try {
        let countries = await country.find({ isActive: true }, '-encExRate').sort('enName');
        if (!countries)
            return res.status(405).send(err || { data: "Try in another time." });
        return res.send(countries);

    } catch (err) {
        return res.status(405).send(err || { data: "Try in another time." });
    }
}

exports.getAllCountries = async(req, res) => {
    try {
        let countries = await country.find({}, '-encExRate').sort('enName');
        if (!countries)
            return res.status(405).send(err || { data: "Try in another time." });
        return res.send(countries);

    } catch (err) {
        return res.status(405).send(err || { data: "Try in another time." });
    }
}

exports.adminGetCountries = async(req, res) => {
    try {
        let _query = {};
        if (req.body.name)
            _query.enName = { $regex: req.body.name, $options: "i" }

        let countries = await country.find(_query, '-encExRate');
        return res.send(countries);

    } catch (err) {
        return res.send(err || { data: "Try in another time." });
    }
}




exports.getCountry = async(req, res) => {
    try {

        let countries = await country.findById({ _id: req.body.id }, '-encExRate');
        return res.send(countries);

    } catch (err) {
        return res.send(err || { data: "No country find with this data." });
    }
}



exports.updateCountry = async(req, res) => {
    try {

        let countries = await country.findById({ _id: req.body.id }, '-encExRate');
        if (!countries || countries.length > 1)
            return res.status(405).send("no country found with this data");
        let _data = req.body;

        let updatedCountry = await country.findByIdAndUpdate({ _id: req.body.id }, { $set: _data }, { new: true });
        if (_.isNil(updatedCountry) || updatedCountry.length < 1)
            return res.status(405).send("We can not update country.Try in another time.");

        return res.send(updatedCountry);

    } catch (err) {
        return res.send(err || { data: "No country find with this data." });
    }
}

exports.create = async(req, res) => {
    // try {
    //     let rawdata = fs.readFileSync('./json/countries.json');
    //     let _cresult = JSON.parse(rawdata);

    // for(let x =0;x < _cresult.length;x++){
    //      var _id = new mongoose.Types.ObjectId;
    //     _cresult[x]._id = _id;
    // }

    //     let c = await country.create(_cresult);

    //     return res.send(c);
    // } catch (err) {
    //     return res.send(err.message);
    // }
};
// let x = _cresult.sort((a, b) => (a.name > b.name) ? 1 : -1)
//    let g = [];
// for(let r = 240;r<250;r++){   
// let _res =   await superagent.get('https://free.currconv.com/api/v7/convert?q=USD_'+x[r].currency+'&compact=ultra&apiKey=7b7c22104b482c82f2cc');
// let u = 'USD_'+x[r].currency;
// let _json = JSON.parse(_res.text);
// console.log(_json);
// console.log("--------");
//  x[r].exRate = _json[u];
// g.push(x[r]);
// }
//dc3ca865e72d9c126249
//cb0379d98a05ee7714fd
// 7b7c22104b482c82f2cc