const Product = require('../models/product.model');
const fs = require('fs');

// controllers/products.js
exports.product_create = async  (req, res) => {
    try{
    let product = new Product(
        {
            name: req.body.name,
            price: req.body.price
        }
    );
    let result = await product.save();
     return res.status(200).send({ statusCode: 200, message:"Success",data:result});
    }catch(err){
        
        return res.status(404).send({ statusCode: 404, message:err.message});
    }

};

exports.product_details = function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) return next(err);
        res.status(200).send({ statusCode: 200, message:"Success",data:product});
    })
};

exports.products = function (req, res) {
    Product.find({}, function (err, product) {
        if (err) return next(err);
        res.status(200).send({ statusCode: 200, message:"Success",data:product});
    })
};

exports.product_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, product) {
        if (err) return next(err);
        res.status(200).send({ statusCode: 200, message:'Product udpated.'});
    });
};

exports.product_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.status(200).send({ statusCode: 200, message:'Deleted successfully'});
    })
};