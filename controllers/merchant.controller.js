const merchant = require('../models/merchant.model');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");

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
        let result = await merchant.find({}, 'clean_name cat_name location_long location_lat');
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
            _query.clean_name = { $regex:  req.query.name , $options: "i" }//{ contains: req.query.name };

        if (req.query.category)
            _query.cat_name = req.query.category;

        if (req.query.page)
            _skip = req.query.page * 10;
        let _merchants = await merchant.find(_query).limit(10).skip(_skip);

        return res.send(_merchants);
    } catch (err) {
        return res.send(err.message);
    }
};
//
exports.updateMerchant = async (req, res) => {
    try {
        let _merchants = await merchant.updateMany({ cat_name: "Sports & Activities" } , {cat_name: "Sports" }).lean();

        return res.send(_merchants);
    } catch (err) {
        return res.send(err.message);
    }
};