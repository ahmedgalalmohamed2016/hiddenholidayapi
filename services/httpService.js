const LogModel = require("../models/log.model");
const validation = require("../configs/validation").validation;
const uuidv4 = require('uuid/v4');
const params = require("../configs/prams").params
module.exports = {
    _checkValidation: async function (req, callback) {
        var apiParam = await this._getApiParam(req.url);
        if (req.method != 'POST')
            return callback(null);
        if (!apiParam)
            return callback(req.url + " is not a valid api");
        console.log("pass");
        req.body = await this._removeExtraKeys(apiParam, req.body);
        req.body = await this._removeEmptyParam(req.body);


        var invalidInput = await this._checkForInput(apiParam, req.body);
        if (invalidInput)
            return callback('please Enter Vaild ' + invalidInput);
        return callback(null);
    },

    _getApiParam: async function (url) {
        if (url == '/')
            return params['_'];

        var paramsKeys = await url.replace(/\//g, "_").replace("_", "").split('?')[0];
        return params[paramsKeys];
    },

    _removeExtraKeys: async function (param, body) {
        Object.keys(body).forEach(function (p) {   
            if (!param.hasOwnProperty(p)){  
                delete body[p];//   param[p];
            }
        });
        return body
    },

    _removeEmptyParam: async function (body) {

        Object.keys(body).forEach(function (b) {
            if (body[b] == null || body[b] == undefined || body[b].length == 0)
                delete body[b];
        })
        return body;
    },
    
    _checkForInput: async function (param, body) {

        var invalidMandatory = await this._checkForMandatory(param, body);

        if (invalidMandatory)
            return invalidMandatory;


        var invalidInput = await this._checkForValidInputs(body);
        if (invalidInput)
            return invalidInput;

        return false;
    },
    _checkForMandatory: async function (param, body) {
        
        var manParamKeys = Object.keys(param).filter(function (p) {
            return param[p];
        });

        var missing = await manParamKeys.filter(function (p) {
            return !body.hasOwnProperty(p); //!body[p];
        });

        return missing.length == 0 ? false : missing[0];
    },
    _checkForValidInputs: async function (body) {

        for (var i in body) {
            if (!await this._isValidInput(i, body[i]))
                return i;
        }
        return false;
    },

    _isValidInput: async function (key, value) {
        var validationRule = validation[key];

        var validationRuleType = typeof validationRule;

        if (validationRuleType == 'undefined')
            return true;

        if (typeof validationRule == 'function')
            return await validationRule(value);
        return new RegExp(validationRule).test(value);
    },
   
    _logSystem: async function (req, res) {
        var reqIp = '0.0.0.0';
                if (req.ip) {
                    reqIp = req.ip.split("::ffff:");

                    if (reqIp.length > 1)
                    reqIp = reqIp[1];
                    else
                        reqIp = req.ip;
                }
                try{
                    const replacerFunc = async () => {
                        const visited = new WeakSet();
                        return (key, value) => {
                          if (typeof value === "object" && value !== null) {
                            if (visited.has(value)) {
                              return;
                            }
                            visited.add(value);
                          }
                          return value;
                        };
                      };
                     
                    let reqTosave =  JSON.stringify(req, replacerFunc());
                    let resTosave =  JSON.stringify(res, replacerFunc());
                    let bodyToSave = JSON.stringify(req.body, replacerFunc());
                    let queryToSave = JSON.stringify(req.query, replacerFunc());
                    LogModel.create({
                        "reqId":uuidv4(),
                        "url": req.url,
                        "req": reqTosave,
                        "res": resTosave,
                        "body": req.body ? bodyToSave : "false",
                        "query": req.query ? queryToSave : "fale",
                        "status": res.statusCode,
                        "fromIp" : reqIp,
                        "method" : req.method
                    },function(err,re){
                      // must send mall
                    //   console.log(err);
                      return true
                    })
                }
                catch(error){
                    // console.log(error);
                }
        
    },

    _handleHeader: async function (res) {
        try {
            res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.header('Access-Control-Allow-Credentials', false);
            // res.end();
        } catch (err) {
            return false;
        }
        return res;
    }

}