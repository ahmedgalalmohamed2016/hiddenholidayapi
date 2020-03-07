//User Token Contain : userDevice , userId , mobileNumber , userRole,randomDate;

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr'
const randomDate = new Date().getTime();
const secretKey = 'asjhut^tg*(2@EASFQ!_+"?]>,nvgfQMIZK#$,Zx[]iwQUsjJ~+-o+ujlcH^^%h(oWs';
module.exports = {
    generateLoginToken: function(userDevice, userId, mobileNumber, userRole) {
        let dataEncrypt = JSON.stringify({
            userDevice: userDevice,
            userId: userId,
            mobileNumber: mobileNumber,
            userRole: userRole,
            randomDate: randomDate
        });

        let cipher = crypto.createCipher(algorithm, userId + userDevice + secretKey)

        let crypted = cipher.update(dataEncrypt, 'utf8', 'hex')
        crypted += cipher.final('hex');

        if (!crypted)
            return false;
        return crypted;
    },

    verifyLoginToken: function(userDevice, userId, tokenData) {
        let decipher = crypto.createDecipher(algorithm, userId + userDevice + secretKey)
        let dec = decipher.update(tokenData, 'hex', 'utf8')
        dec += decipher.final('utf8');
        let check = IsJsonString(dec);

        if (!check)
            return false;
        return JSON.parse(dec);
    },

    generateToken: function(dataEncrypt) {
        let cipher = crypto.createCipher(algorithm, secretKey)

        let crypted = cipher.update(dataEncrypt, 'utf8', 'hex')
        crypted += cipher.final('hex');

        if (!crypted)
            return false;
        return crypted;
    },
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function IsJsonToken(str) {
    try {
        JSON.stringify(str);
    } catch (e) {
        return false;
    }
    return true;
}