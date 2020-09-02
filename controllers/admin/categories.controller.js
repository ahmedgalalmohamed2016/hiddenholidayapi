const CategoryModel = require('../../models/categories.model');
const UserModel = require('../../models/user.model');
const MerchantModel = require('../../models/merchant.model');
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
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './public/categories' });


exports.upload = async(req, res) => {
    try {
        if (req.files.uploads[0].path) {
            var img = req.files.uploads[0].path;
            var resl = img.split("/");
            var ll = resl.length - 1;

            let categories = await CategoryModel.findById({ _id: req.query.id });
            if (!categories || categories.length > 1)
                return res.status(405).send({ statusCode: 405,message:"no category found with this data"});

            let updatedCategory = await CategoryModel.findByIdAndUpdate({ _id: req.query.id }, { $set: { smallImage: resl[ll] } }, { new: true });
            if (_.isNil(updatedCategory) || updatedCategory.length < 1)
                return res.status(405).send({ statusCode: 405,message:"We can not update category.Try in another time."});

            // return res.send(updatedCategory);

            return res.status(200).send({ statusCode: 200,message:"Success",data:{ path: resl[ll] }});
        } else {
            return res.status(406).send({ statusCode: 406,message:'File i not valid.'});
        }
    } catch (err) {
        return res.status(406).send({ statusCode: 406,message:'File i not valid.'});
    }
}

exports.create = async(req, res) => {
    try {
        let Categories = await CategoryModel.find({ enName: req.body.enName }, '-encExRate');
        if (!Categories || Categories.length > 1)
            return res.status(405).send({ statusCode: 405,message:"This category name already created before"});
        let _data = req.body;

        let createdCategory = await CategoryModel.create(_data);
        if (_.isNil(createdCategory) || createdCategory.length < 1)
            return res.status(405).send({ statusCode: 405,message:"We can not create country.Try in another time."});

        return res.status(200).send({ statusCode: 200,message:"Success",data:createdCategory});

    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:err || "We can not create country.Try in another time." });
    }
};

exports.adminGetCategories = async(req, res) => {
    try {
        let _query = {};
        if (req.body.name)
            _query.enName = { $regex: req.body.name, $options: "i" }

        let categoriesData = await CategoryModel.find(_query);
        return res.status(200).send({ statusCode: 200,message:"Success",data:categoriesData});

    } catch (err) {
        return res.status(404).send({ statusCode: 200,message:err || "Try in another time." });
    }
}

exports.getCategories = async(req, res) => {
    try {
        let getCat = await CategoryModel.find({ isActive: true });
        if (!getCat)
            return res.status(405).send({ statusCode: 405,message:"no category found"});
        return res.status(200).send({ statusCode: 200,message:"Success",data:getCat});

    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:err || "Try in another time." });
    }
}

exports.getCategory = async(req, res) => {
    try {

        let categoryData = await CategoryModel.findById({ _id: req.body.id });
        return res.status(200).send({ statusCode: 200,message:"Success",data:categoryData});

    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:err || "No Category find with this data." });
    }
}

exports.updateCategory = async(req, res) => {
    try {

        let categories = await CategoryModel.findById({ _id: req.body.id });
        if (!categories || categories.length > 1)
            return res.status(405).send({ statusCode: 405,message:"no category found with this data"});
        let _data = req.body;

        let updatedCategory = await CategoryModel.findByIdAndUpdate({ _id: req.body.id }, { $set: _data }, { new: true });
        if (_.isNil(updatedCategory) || updatedCategory.length < 1)
            return res.status(405).send({ statusCode: 405,message:"We can not update category.Try in another time."});

        return res.status(200).send({ statusCode: 200,message:"Success",data:updatedCategory});

    } catch (err) {
        return res.status(404).send({ statusCode: 404,message:err || "No category find with this data." });
    }
}