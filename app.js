// const express = require('express');
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

const bodyParser = require('body-parser');

const merchant = require('./routes/merchant.route'); 
const user = require('./routes/user.route'); 
const deal = require('./routes/deal.route'); 
// const app = express();
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

  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', false);

  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/merchants', merchant);
app.use('/user', user);
app.use('/deal', deal);

io.on('connection', (socket) => {
  
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  });
 
  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
  });
});

let port = 1337;

app.listen(port, () => {
  console.log('Server is up and running on port numner ' + port);
});