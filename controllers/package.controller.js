const PackageModel = require('../models/package.model');
const superagent = require('superagent');
const tokenService = require('../services/tokenService');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './public/categories' });

exports.upload = async(req, res) => {
    try {
        res.status(404).send({ statusCode: 404, message:'File uploaded succesfully.'});
    } catch (err) {
        res.status(406).send({ statusCode: 404, message:'File uploaded succesfully.'});
    }
}

exports.getPackage = async(req, res) => {
    try {
        let countries = await country.find({ isActive: true }, '-encExRate');
        return res.status(200).send({ statusCode: 200, message:"Success",data:countries});

    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err || { data: "Try in another time."} });
    }
}

exports.adminGetPackages = async(req, res) => {
    try {
        let _query = {};
        if (req.body.name)
            _query.enName = { $regex: req.body.name, $options: "i" }

        let packagesData = await PackageModel.find(_query, '-encExRate');
        return res.status(200).send({ statusCode: 200, message:"Success",data:packagesData});

    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err || { data: "Try in another time." }});
    }
}


exports.getPackage = async(req, res) => {
    try {

        let countries = await PackageModel.findById({ _id: req.body.id }, '-encExRate');
        return res.status(200).send({ statusCode: 200, message:"Success",data:countries});

    } catch (err) {
        return res.status(404).send({ statusCode: 404, message: err ||  "No package find with this data." });
    }
}



exports.updatePackage = async(req, res) => {
    try {

        let packages = await PackageModel.findById({ _id: req.body.id }, '-encExRate');
        if (!packages || packages.length > 1)
            return res.status(404).send({ statusCode: 404, message:"no package found with this data"});
        let _data = req.body;

        let updatedPackage = await PackageModel.findByIdAndUpdate({ _id: req.body.id }, { $set: _data }, { new: true });
        if (_.isNil(updatedPackage) || updatedPackage.length < 1)
            return res.status(404).send({ statusCode: 404, message:"We can not update package.Try in another time."});

        return res.status(200).send({ statusCode: 200, message:"Success",data:updatedPackage});

    } catch (err) {
        return res.status(404).send({ statusCode: 404, message:err || "No package find with this data." });
    }
}

exports.create = async(req, res) => {
    try {
        let packageData = req.body;
        const createdPackage = await PackageModel.create(packageData);
        if (_.isNil(createdPackage) || createdPackage.length < 1)
            return res.status(404).send({ statusCode: 404, message:"Can not create package for now.Please try in another time."});
        return res.status(200).send({ statusCode: 200, message:"Success",data:createdPackage});
    } catch (err) {
        return res.status(404).send({ statusCode: 404, message: "can not create package for now.Please try in another time." });
    }
};