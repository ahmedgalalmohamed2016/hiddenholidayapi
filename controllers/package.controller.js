const PackageModel = require('../models/package.model');
const superagent = require('superagent');
const tokenService = require('../services/tokenService');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

exports.getPackage = async (req, res) => {
    try {
        let countries = await country.find({ isActive: true }, '-encExRate');
        return res.send(countries);

    } catch (err) {
        return res.send(err || { data: "Try in another time." });
    }
}

exports.adminGetPackages = async (req, res) => {
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


exports.getPackage = async (req, res) => {
    try {

        let countries = await country.findById({ _id: req.body.id }, '-encExRate');
        return res.send(countries);

    } catch (err) {
        return res.send(err || { data: "No country find with this data." });
    }
}



exports.updatePackage = async (req, res) => {
    try {

        let countries = await country.findById({ _id: req.body.id }, '-encExRate');
        if (!countries || countries.length > 1)
            return res.status(405).send("no country found with this data");
        let _data = req.body;

        let updatedCountry = await country.findByIdAndUpdate({ _id: req.body.id },
            { $set: _data }, { new: true });
        if (_.isNil(updatedCountry) || updatedCountry.length < 1)
            return res.status(405).send("We can not update country.Try in another time.");

        return res.send(updatedCountry);

    } catch (err) {
        return res.send(err || { data: "No country find with this data." });
    }
}

exports.create = async (req, res) => {
    try {
        let packageData = req.body;
        const createdPackage = await PackageModel.create(packageData);
        if (_.isNil(createdPackage) || createdPackage.length < 1)
            return res.status(405).send("We can not create package for now.Please try in another time.");
        return res.send(createdPackage);
    } catch (err) {
        return res.send({ data: "We can not create package for now.Please try in another time." });
    }
};