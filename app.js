const express = require('express');
// let app = require('express')();
// let http = require('http').Server(app);
// let io = require('socket.io')(http);

const bodyParser = require('body-parser');
const config = require('./configs/main');
const path = require('path');

const merchant = require('./routes/merchant.route');
const bankAccountRoutes = require('./routes/bankAccount.route');
const userRoutes = require('./routes/user.route');
const dealRoutes = require('./routes/deal.route');
const merchantUser = require('./routes/merchantUser.route');
const madfooatcom = require('./routes/madfooatcom.route');
const adminRoutes = require('./routes/admin.route');
const countriesRoutes = require('./routes/country.route');
const packageRoutes = require('./routes/package.route');
const categoriesRoutes = require('./routes/categories.route');
const transactionRoutes = require('./routes/transaction.route');
const cardRoutes = require('./routes/card.route');
const walletRoutes = require('./routes/wallet.route');
const bidRoutes = require('./routes/bid.route');
const merchantAdminRoutes = require('./routes/merchantAdmin.route');
const ealbRoutes = require('./routes/ealb.route');
const httpService = require("./services/httpService");

const app = express();
// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://drizzleup:neejde5m2KnkhPYu@ds137498.mlab.com:37498/drizzleup';

app.use('/static', express.static('public'))
app.use('/', express.static(path.join(__dirname, 'public/admin')));


const mongoDB = process.env.MONGODB_URI || dev_db_url;
const options = {
    keepAlive: 1,
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongoDB, options);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for encoded bodies

app.use(async function(req, res, next) {
  await httpService._handleHeader(res);
  await httpService._logSystem(req, res);
  await httpService._checkValidation(req, async function (err, result) {
    if (!!err) {
        var results = ({
            statusCode: 404,
            message: err
        });
        await httpService._logSystem(req, res);
        return res.status(404).send(results);
    } 
  })
  next();
});
app.use('/madfooatcom', madfooatcom)
app.use('/merchants', merchant);
app.use('/user', userRoutes);
app.use('/api/bank', bankAccountRoutes);
app.use('/merchant/user', merchantUser);
app.use('/api/deals', dealRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/countries', countriesRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/merchantAdmin', merchantAdminRoutes);
app.use('/api/ealb', ealbRoutes);



let port = 2100;

app.listen(port, () => {
    console.log(makeLine(5));
    console.log('Server is up and running on port numner ' + port);
    console.log(revertmakeLine(5));
});



function revertmakeLine(length) {
    // length has the number of lines the triangle should have
    var line = "";
    for (var i = length; i >= 1; i--) {
      // Enter the first for loop for the number of lines
      for(var j=i; j>=1; j--){ 
        // Enter the second loop to figure how many *'s to print based on the current line number in i. So the 1st line will have 1 *, the second line will have 2 *s and so on.
        line += "*";
      }
      // Add a newline after finishing printing the line and move to the next line in the outer for loop
      line+="\n";
    }
    // Print an additional newline "\n" if desired.
    return line;
  }
  function makeLine(length) {
    // length has the number of lines the triangle should have
    var line = "";
    for (var i = 1; i <= length; i++) {
      // Enter the first for loop for the number of lines
      for(var j=1; j<=i; j++){ 
        // Enter the second loop to figure how many *'s to print based on the current line number in i. So the 1st line will have 1 *, the second line will have 2 *s and so on.
        line += "*";
      }
      // Add a newline after finishing printing the line and move to the next line in the outer for loop
      line+="\n";
    }
    // Print an additional newline "\n" if desired.
    return line;
  }