const CategoryModel = require('../../models/categories.model');
const UserModel = require('../../models/user.model');
const DealModel = require('../../models/deal.model');
const VerificationModel = require('../../models/verification.model');
const passwordService = require('../../services/passwordService');
const sendSmsService = require('../../services/sendSmsService');
const tokenService = require('../../services/tokenService');
const _ = require("lodash");
const request = require("superagent");
var fs = require("fs");
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

exports.create = async(req, res) => {
    try {
        let Categories = await CategoryModel.find({ enName: req.body.enName }, '-encExRate');
        if (!Categories || Categories.length > 1)
            return res.status(405).send("This category name already created before");
        let _data = req.body;

        let createdCategory = await CategoryModel.create(_data);
        if (_.isNil(createdCategory) || createdCategory.length < 1)
            return res.status(405).send("We can not create country.Try in another time.");

        return res.send(createdCategory);

    } catch (err) {
        return res.send(err || { data: "We can not create country.Try in another time." });
    }
};

exports.adminGetCategories = async(req, res) => {
    try {
        let _query = {};
        if (req.body.name)
            _query.enName = { $regex: req.body.name, $options: "i" }

        let categoriesData = await CategoryModel.find(_query);
        return res.send(categoriesData);

    } catch (err) {
        return res.send(err || { data: "Try in another time." });
    }
}

exports.getCategory = async(req, res) => {
    try {

        let categoryData = await CategoryModel.findById({ _id: req.body.id });
        return res.send(categoryData);

    } catch (err) {
        return res.send(err || { data: "No Category find with this data." });
    }
}

exports.updateCategory = async(req, res) => {
    try {

        let categories = await CategoryModel.findById({ _id: req.body.id });
        if (!categories || categories.length > 1)
            return res.status(405).send("no category found with this data");
        let _data = req.body;

        let updatedCategory = await CategoryModel.findByIdAndUpdate({ _id: req.body.id }, { $set: _data }, { new: true });
        if (_.isNil(updatedCategory) || updatedCategory.length < 1)
            return res.status(405).send("We can not update category.Try in another time.");

        return res.send(updatedCategory);

    } catch (err) {
        return res.send(err || { data: "No category find with this data." });
    }
}