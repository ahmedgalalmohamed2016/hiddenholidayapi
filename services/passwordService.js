const crypto = require('crypto');
const encPasswordKey = "29b298ka-8288-4821-a4fc-95aa5412e69d29b298ca-8288-4821-a4fc-95aa5412e69d";
module.exports = {

    comparePassword: function (pass, userPass, userId) {
        const hash = crypto.createHmac('sha256', String(userId) + encPasswordKey)
            .update(String(pass))
            .digest('hex');
        if (hash == userPass)
            return true;
        return false;
    },

    generatePassword: function (pass, userId) {
        try {
            const hash = crypto.createHmac('sha256', String(userId) + encPasswordKey)
                .update(String(pass))
                .digest('hex');
            return hash;
        } catch (err) {
            return false;
        }
    }

}