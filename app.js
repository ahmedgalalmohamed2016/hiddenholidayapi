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
mongoose.connect(mongoDB, options);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', false);

    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/merchants', merchant);
app.use('/user', userRoutes);
app.use('/bank', bankAccountRoutes);
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



let port = 3100;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});