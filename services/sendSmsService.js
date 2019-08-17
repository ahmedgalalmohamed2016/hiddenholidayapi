var accountSid = 'AC320234453e1d8abf85d56d9fcaa40f68'; // Your Account SID from www.twilio.com/console
var authToken = 'c48fff144aca485545f1fb88d5de0e72';
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

module.exports = {
    sendActivationAccountsms: function (req, Phone, verificationCode) {
        client.messages.create({
            body: 'Welcome to hiddenholiday your activation number ' + verificationCode,
            to: '+' + Phone, // Text this number
            from: '+13852904826' // From a valid Twilio number
        })
            .then((message) => console.log(message.sid));
        return true;
    },
    sendResetPasswordsms: function (req, verificationCode) {
        return true;
    }
};