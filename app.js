// app.js
const express = require('express');
const bodyParser = require('body-parser');

const merchant = require('./routes/merchant.route'); // Imports routes for the products
const app = express();
// Set up mongoose connection
const mongoose = require('mongoose');
  let dev_db_url = 'mongodb://admin:2wGnLj9ayKfeZLCQaVgy5WvBW4nuQemsy977BvdbJykmjq4c@ds045679.mlab.com:45679/hiddenholidaydb';

const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/merchants', merchant);

let port = 1337;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});