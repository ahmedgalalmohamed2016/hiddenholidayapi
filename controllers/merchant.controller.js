const merchant = require('../models/merchant.model');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');

exports.merchant_prepare = async (req, res) => {
    try {
        let rawdata = fs.readFileSync("items.json");
        let data = JSON.parse(rawdata);

        // for (let x = 0; x < data.length; x++) {
        //     data[x].id = uuidv4();
        // }
        // const _merchants = await Merchants.createEach(data).fetch();
        // if (_.isNil(_merchants)) return 404;
        // return res.send(data);
        // let merchantdata = new merchant(data);
        let result = await merchant.insertMany(data);
        return res.send(result);
    } catch (err) {

        return res.send(err.message);
    }
};

exports.maps = async (req, res) => {
    try {
        let result = await merchant.find({}, 'clean_name cat_name location_long location_lat _id');
        return res.send(result);
    } catch (err) {
        return res.send(err.message);
    }
};

exports.merchantById = async (req, res) => {
    try {
        console.log(req.query.id);
        let _merchants = await merchant.findById({ _id: req.query.id });

        return res.send(_merchants);
    } catch (err) {
        return res.send(err.message);
    }
};

exports.merchants = async (req, res) => {
    try {
        let _query = {};
        let _skip = 0;
        //
        if (req.query.name)
            _query.clean_name = { $regex: req.query.name, $options: "i" }//{ contains: req.query.name };

        if (req.query.category)
            _query.cat_name = req.query.category;

        if (req.query.page)
            _skip = req.query.page * 10;
        let _merchants = await merchant.find(_query, null, { sort: { clean_name: 1 } }).limit(10).skip(_skip);

        return res.send(_merchants);
    } catch (err) {
        return res.send(err.message);
    }
};

exports.merchants_favourites = async (req, res) => {
    try {
        if(!req.body.merchants || req.body.merchants.length <1)
        return res.status(405).send("Please enter valid favourites data");

        let data = [];
        console.log(typeof req.body);
        console.log(typeof req.body.merchants);
       // return res.send(req.body);
        for(let x= 0;x <=req.body.merchants.length;x++){
            let d = mongoose.Types.ObjectId(req.body.merchants[x]);
           data.push(d);
        }
        let _merchants = await merchant.find({ _id: { $in: data } }, null, { sort: { clean_name: 1 } });
        return res.send(_merchants);
    } catch (err) {
        return res.send(err);
    }
};

exports.updateMerchant = async (req, res) => {
    try {
        let _merchants = await merchant.updateMany({} , {country: "Jordan" }).lean();

        return res.send(_merchants);
    } catch (err) {
        return res.send(err.message);
    }
};

exports.updateDummyMerchant = async (req, res) => {
    try {
        let _merchants = await merchant.updateMany({} , {country: "Jordan" }).lean();

        return res.send(_merchants);
    } catch (err) {
        return res.send(err.message);
    }
};