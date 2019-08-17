// app.js
const express = require('express');
const bodyParser = require('body-parser');

const merchant = require('./routes/merchant.route'); 
const user = require('./routes/user.route'); 
const app = express();
// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://admin:2wGnLj9ayKfeZLCQaVgy5WvBW4nuQemsy977BvdbJykmjq4c@ds045679.mlab.com:45679/hiddenholidaydb';

const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/merchants', merchant);
app.use('/user', user);

let port = 1337;

app.listen(port, () => {
  console.log('Server is up and running on port numner ' + port);
});