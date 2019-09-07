const Product = require('../models/product.model');

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
     return res.send(result);
    }catch(err){
        
        return res.send(err.message);
    }

};

exports.product_details = function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) return next(err);
        res.send(product);
    })
};

exports.products = function (req, res) {
    Product.find({}, function (err, product) {
        if (err) return next(err);
        res.send(product);
    })
};

exports.product_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, product) {
        if (err) return next(err);
        res.send('Product udpated.');
    });
};

exports.product_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};