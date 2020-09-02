const LogModel = require("../models/log.model");
const validation = require("../configs/validation").validation;
const uuidv4 = require('uuid/v4');
const params = require("../configs/prams").params
module.exports = {
    _checkValidation: function (req, callback) {
        var apiParam = this._getApiParam(req.url);
        if (!apiParam)
            return callback(req.url + " is not a valid api");
        if (req.method != 'POST')
            return callback(null);
        req.body = this._removeExtraKeys(apiParam, req.body);
        req.body = this._removeEmptyParam(req.body);


        var invalidInput = this._checkForInput(apiParam, req.body);
        if (invalidInput)
            return callback('please Enter Vaild ' + invalidInput);
        return callback(null);
    },

    _getApiParam: function (url) {
        if (url == '/')
            return params['_'];

        var paramsKeys = url.replace(/\//g, "_").replace("_", "").split('?')[0];
        return params[paramsKeys];
    },

    _removeExtraKeys: function (param, body) {
        Object.keys(body).forEach(function (p) {            
            if (!param.hasOwnProperty(p))
                delete body[p];//   param[p];
        });
        return body
    },

    _removeEmptyParam: function (body) {

        Object.keys(body).forEach(function (b) {
            if (body[b] == null || body[b] == undefined || body[b].length == 0)
                delete body[b];
        })
        return body;
    },
    
    _checkForInput: function (param, body) {

        var invalidMandatory = this._checkForMandatory(param, body);

        if (invalidMandatory)
            return invalidMandatory;


        var invalidInput = this._checkForValidInputs(body);
        if (invalidInput)
            return invalidInput;

        return false;
    },
    _checkForMandatory: function (param, body) {
        
        var manParamKeys = Object.keys(param).filter(function (p) {
            return param[p];
        });

        var missing = manParamKeys.filter(function (p) {
            return !body.hasOwnProperty(p); //!body[p];
        });

        return missing.length == 0 ? false : missing[0];
    },
    _checkForValidInputs: function (body) {

        for (var i in body) {
            if (!this._isValidInput(i, body[i]))
                return i;
        }
        return false;
    },

    _isValidInput: function (key, value) {
        var validationRule = validation[key];

        var validationRuleType = typeof validationRule;

        if (validationRuleType == 'undefined')
            return true;

        if (typeof validationRule == 'function')
            return validationRule(value);
        return new RegExp(validationRule).test(value);
    },

    _logSystem: function (req, res) {
        var reqIp = '0.0.0.0';
                if (req.ip) {
                    reqIp = req.ip.split("::ffff:");

                    if (reqIp.length > 1)
                    reqIp = reqIp[1];
                    else
                        reqIp = req.ip;
                }
        LogModel.create({
            "reqId":uuidv4(),
            "url": req.url,
            "req": req.toString(),
            "res": res.toString(),
            "body": req.body ? req.body.toString() : "false",
            "query": req.query ? req.query.toString() : "fale",
            "status": res.statusCode,
            "fromIp" : reqIp,
            "method" : req.method
        },function(err,re){
          // must send mall
          // console.log(err);
          return true
        })
    },

    _handleHeader: function (res) {
        try {
            res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Credentials', false);
        
        } catch (err) {
            return false;
        }
    }

}