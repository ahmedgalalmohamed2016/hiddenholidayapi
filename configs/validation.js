
var uuid = /^[0-9a-f]{8}\-[0-9a-f]{4}\-[4][0-9a-f]{3}\-[89ab][0-9a-f]{3}\-[0-9a-f]{12}$/,
objectId = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,    
url = /^((https?:\/\/)?(www\.)?([\da-zA-Z-]+)\.([a-z]{2,6})\.?([\da-z]{2,6})?([\/\s\S]*)*$)|((https?:\/)?((\/|^|\.)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]?\d))){4}(\:[0-9]{1,4})?([\/\s\S]*)*$)/,
    email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._%+-]+\.[a-zA-Z]{2,128}$/,
    mobile = /^[0-9]{7,15}$/,
    mobileStore = /^[0-9]{5,15}$/,
    char = /^[a-zA-Z]{1}$/,
    boolean = /^(true|false)$/,
    amount = /^[0-9]{0,5}([.][0-9]{1,2})?$/,
    offerAmount = /^[1-9][0-9]{0,5}([.][0-9]{1,2})?$/,
    pinCode = /^[0-9]{4}$/,
    code = /^[0-9]{6}$/,
    walletCode = /^[0-9]{4}$/,
    numberOf = /^[1-9][0-9]{0,100}$/,
    percent = /^[0-9]{0,2}(\.[0-9]{1,2}){0,1}$/,
    Validator = require('validator-json'),
    age = /^[1-9][0-9]{1,1}$/,
    adminPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,35}$/,
    faxRegex = /^\+?[0-9]{6,}$/,

    allCharsWithRange = function (min, max) {
        return new RegExp('^[\\s\\S]{' + min + ',' + max + '}$')
    },
    imageExt = function () {
        return new RegExp(/^.*\.(jpg|jpeg|gif|JPG|png|PNG)$/)
    },
    wordsWithSpaceRange = function (min, max) {
        return new RegExp('^[\\w\\s\\S()-`.+,\/\"]{' + min + ',' + max + '}$')
    },
    isDate = function (date, req) {
        try {
            date = date.split('T')[0]
            var _date = new Date(date).toISOString().slice(0, 10).replace(/-/g, "/");
        } catch (e) {
            return false;
        }
        if (!sails.config.validation.dateValidation.test(date)) {
            return false;
        }

        _date = _date.split('/').map(Number);

        //validate day
        if (_date[2] < 1 || _date[2] > 31 ||
            (_date[1] == 2 && _date[2] > 29)
        )
            return false;

        //validate month
        if (_date[1] < 1 || _date[1] > 12)
            return false;

        //validate year
        if (_date[0] < 1900 || _date[0] > 3000)
            return false;

        if (!!req)
            req.systemXdate = _date[1] + '/' + _date[2] + '/' + _date[0]

        return true;
    },
    isDateOfBirth = function (date, req) {
        if (isDate(date, req)) {
            date = new Date(date).toISOString().slice(0, 10).replace(/-/g, "/");
            var today = new Date().toISOString().slice(0, 10).replace(/-/g, "/");
            if (today <= date)
                return false;
            return true;
        }
        return false;

    },
    imagesArray = function (images) {
        try {
            images = JSON.parse(images);
        } catch (err) {
            images = images;
        }
        if (typeof (images) == 'object' && images.length > 0) {
            for (var i in images) {
                if (!imageExt().test(images[i].fileName) || !imageExt().test(images[i].nativeName))
                    return false;
            }
            return true;
        } else {
            return false;
        }
    },
    CharArray = function (chars) {

        try {
            chars = chars.replace(/'/g, '"');
            chars = JSON.parse(chars);
        } catch (err) {
            chars = chars;
        }
        if (Array.isArray(chars) && chars.length > 0) {
            for (var i in chars) {
                if (['A1', 'A2', 'B1', 'B2', 'C'].indexOf(chars[i]) < 0)
                    return false;
            }
            return true;
        } else {
            return false;
        }
    },
    uuidArray = function (ids) {

        try {
            ids = ids.replace(/'/g, '"');
            ids = JSON.parse(ids);
        } catch (err) {
            ids = ids;
        }
        if (Array.isArray(ids) && ids.length > 0) {
            for (var i in ids) {
                if (!new RegExp(uuid).test(ids[i]))
                    return false;
            }
            return true;
        } else {
            return false;
        }
    },
    accessDataValidation = function (accessData) {
        Validator = require('validator-json');
        try {
            var objectPass = JSON.parse(accessData);
        } catch (e) {
            return false;
        }
        var schema = sails.config.validation.merchantRoleValidation;
        var passValidator = new Validator(objectPass, schema, 'objectPass');
        var passJson = passValidator.validate();
        if (passJson.length > 0)
            return false;
        return true;
    },
    buttonValidate = function (button) {
        Validator = require('validator-json');
        try {
            var objectPass = JSON.parse(button);
        } catch (e) {
            var objectPass = button;
        }
        var schema = sails.config.validation.siteButtonValidation;
        var passValidator = new Validator(objectPass, schema, 'objectPass');
        var passJson = passValidator.validate();
        if (passJson.length > 0)
            return false;
        return true;
    },
    items = function (items) {
        Validator = require('validator-json');
        try {
            var objectPass = JSON.parse(items);
        } catch (e) {
            return false;
        }
        var schema = sails.config.validation.itemsValidation;
        for (var i in objectPass) {
            var passValidator = new Validator(objectPass[i], schema, 'objectPass');
            var passJson = passValidator.validate();

            if (passJson.length > 0)
                return false;

            if ((!new RegExp(amount).test(objectPass[i]['price'])) || (!new RegExp(amount).test(objectPass[i]['quantity'])))
                return false;
        }
        return true;
    },
    invoiceDetail = function (invoiceDetails) {
        try {
            invoiceDetails = JSON.parse(invoiceDetails)
        } catch (ex) {
            return false;
        }
        return true;
    }
module.exports.validation = {
    // uuid
    uuidV4: uuid,
    idValidation: uuid,
    acquirerId: uuid,
    discountId: uuid,
    fromId: uuid,
    toId: uuid,
    MID: allCharsWithRange(1, 36),
    merchantId: objectId,
    systemOperatorId: uuid,
    userId: objectId,
    invoiceId: objectId,
    templateId: uuid,
    filterId: uuid,
    agentId: uuid,
    storeId: uuid,
    appId: uuid,
    sessionId: uuid,
    vendorId: uuid,
    transactionId: uuid,
    cartId: objectId,
    id: objectId,
    itemId: uuid,
    offerId: objectId,
    cardId: objectId,
    scheduleId: uuid,
    userWalletId: uuid,
    walletId: uuid,
    terminalId: uuid,
    walletIdHashed: /^[\S]{1,256}$/,
    cardNumHashed: /^[\S]{1,256}$/,
    cardExpHashed: /^[\S]{1,256}$/,
    cardHolderNameHashed: /^[\S]{1,256}$/,
    accountHashed: /^.{1,256}$/,
    walletAppId: uuid,
    taskId: uuid,
    sourceId: uuid,
    accountId: uuid,
    bankAccountId: uuid,
    settlementId: uuid,
    attachmentId: /^.*\.(jpg|jpeg|gif|png|pdf)$/i,
    attachment: uuid,
    bankId: uuid,
    brandId: uuid,
    branchId: uuid,
    roleId: uuid,
    categoryId: uuid,
    operatorId: uuid,
    orderId: uuid,
    operationId: allCharsWithRange(1, 32),
    siteId: uuid,
    serviceId: uuid,
    otherId: uuid,
    merchantUserId: uuid,
    taxesId: allCharsWithRange(1, 16),
    websiteId: uuid,
    'data.id': uuid,
    lastUpdatedBy: uuid,
    productId: uuid,
    notificationId: uuid,
    sourceOfMoney: uuid,

    // boolean
    isApproved: boolean,
    isDraft: boolean,
    approve: boolean,
    directPayment: boolean,
    isActive: boolean,
    hasEmail: boolean,
    hasMobile: boolean,
    isDeleted: boolean,
    isDefault: boolean,
    isDelete: boolean,
    pEmail: boolean,
    pFacebookUrl: boolean,
    pGoogle: boolean,
    pPhone: boolean,
    pUserName: boolean,
    production: boolean,
    channelMedia: boolean,
    channelVap: boolean,
    channelEmail: boolean,
    channelSMS: boolean,
    channelType: /^(store|website|app|terminal|cart)$/i,
    channelId: uuid,
    // isDate
    fromDate: isDate,
    issueDate: isDate,
    dueDate: isDate,
    scheduleDate: isDate,
    date: isDate,
    toDate: isDate,
    startingDate: isDate,
    endingDate: isDate,
    createdAt: isDate,
    updatedAt: isDate,
    publishFromDate: isDate,
    publishToDate: isDate,
    // mobile
    mobileNumber: mobile,
    forgetPassword: mobile,
    mobile: mobile,
    newMobileNumber: mobile,
    businessMobileNumber: mobile,
    phone: mobile,
    addressPhone: mobile,
    branchPhone: mobile,
    fax: faxRegex,
    invoiceNumber: allCharsWithRange(1, 100),
    // amount
    amount: amount,
    discount: amount,
    balance: amount,
    fromBalance: amount,
    toBalance: amount,
    totalAmount: amount,
    originalAmount: offerAmount,
    amountAfterDiscount: offerAmount,
    giftValue: offerAmount,
    spendMoney: amount,
    redeemCashMoney: amount,
    price: offerAmount,
    giftDiscount: percent,
    redeemAmountValue: amount,
    styleId: uuid,
    itemAmount: offerAmount,
    tax: amount,
    // pinCode
    pinCode: pinCode,
    pin: pinCode,
    code: code,
    newPinCode: pinCode,
    walletCode: walletCode,
    // email
    email: email,
    branchEmail: email,
    // URLs
    facebook: url,
    website: url,
    twitter: url,
    link: url,
    onaccept: url,
    onfail: url,
    onAccept: url,
    onFail: url,
    profileUrl: url,
    photos: url, // google and facebook soical login
    stepTime: numberOf,
    apiTime: numberOf,
    // number of operations
    numberOfPayment: numberOf,
    numberOfRequests: numberOf,
    numberOfOperation: numberOf,
    numberOfOperations: numberOf,
    numberOfViews: numberOf,
    numberOfClicks: numberOf,
    numberOfItems: numberOf,
    numberOfFreeItems: numberOf,
    receivedPoints: numberOf,
    redeemCashPoint: numberOf,
    redeemPercentPoint: numberOf,
    redeemProductPoint: numberOf,
    // all characters with range
    id: allCharsWithRange(1, 256),
    registerScanNativeName: allCharsWithRange(1, 256),
    taxesScanNativeName: allCharsWithRange(1, 256),
    description: allCharsWithRange(1, 1000),
    termsAndConditions: allCharsWithRange(1, 256),
    productDetails: allCharsWithRange(1, 256),
    button: buttonValidate,
    mobileDeviceToken: allCharsWithRange(1, 256),
    token: allCharsWithRange(1, 1024),
    recaptchaToken: allCharsWithRange(1, 1024),
    socialToken: /^[0-9a-f]{32}\:[0-9a-f]{1,512}$/,
    deviceToken: /^[0-9a-f]{32}\:[0-9a-f]{1,512}$/,
    authorization: /^[0-9a-f]{32}\:[0-9a-f]{1,512}$/,
    removeDeviceToken: /^[0-9a-f]{32}\:[0-9a-f]{1,512}$/,
    uHeader: allCharsWithRange(1, 256),
    keyword: allCharsWithRange(0, 100),
    domainName: allCharsWithRange(0, 100),
    character: allCharsWithRange(0, 50),
    userCode: /^[\_\.\-a-zA-Z0-9]{2,128}[0-9][0-9]{0,100}$/,
    userType: /^(contact|user)$/i,
    removeMode: /^(onlyOne|all)$/i,
    couponCode: /^[\_\.\-a-zA-Z0-9]{2,128}[0-9][0-9]{0,100}$/,
    orderBy: /^(email|firstName|lastName|currencyIso|createdAt|updatedAt|amount|serviceType|orderId|status|serviceId|transactionType|userName)$/,
    offerSortBy: /^(sales|updatedAt|title|publishFromDate|fromDate)$/i,
    offerLoyaltySortBy: /^(firstName|email)$/i,
    userSortBy: /^(name|mobileNumber|email|gender|age)$/i,
    orderContactby: /^(name|mobileNumber|email)$/i,
    settlementOrderBy: /^(totalAmount|merchantAmount|userName|fromDate|toDate|vapulusAmount|updatedAt|createdAt|numberOfTransaction|status)$/i,
    sourceType: /^(card|balance|gift|wallet)$/i,
    websiteState: /^(activate|deactivate)$/i,
    transactionType: /^(pos|cash|app|offer|website|refund|terminal)$/i,
    businessBio: /^[\s\S\n]{3,1000}$/,
    filterLocation: /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+[\s\S]*(,)*[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]*$/,
    filterType: /^(customer|transaction)$/i,
    statusCode: /^[0-9]{3}$/,
    location: allCharsWithRange(1, 100),
    originalStock: allCharsWithRange(1, 100),
    comment: allCharsWithRange(1, 100),
    contactName: allCharsWithRange(1, 100),
    pageTitle: allCharsWithRange(1, 100),
    metaType: allCharsWithRange(1, 100),
    redeemProductTitle: allCharsWithRange(1, 100),
    redeemProductDescription: allCharsWithRange(1, 500),
    withoutFriends: allCharsWithRange(1, 100),
    auto_complete: allCharsWithRange(1, 100),
    discription: allCharsWithRange(0, 1000),
    emailBody: allCharsWithRange(0, 3000),
    branchDescription: allCharsWithRange(0, 1000),
    contact: allCharsWithRange(1, 3000),
    access: accessDataValidation,
    // words with spaces in range
    'attachment': allCharsWithRange(1, 128),
    'attachmentNativeName': allCharsWithRange(1, 256),
    'data.brandName': allCharsWithRange(1, 128),
    headLine: allCharsWithRange(1, 128),
    businessName: allCharsWithRange(3, 100),
    nickname: allCharsWithRange(3, 100),
    branchAddress: allCharsWithRange(1, 100),
    locationType: allCharsWithRange(1, 128),
    title: allCharsWithRange(1, 200),
    walletName: allCharsWithRange(1, 50),
    itemTitle: allCharsWithRange(1, 200),
    brand: allCharsWithRange(1, 128),
    brandName: allCharsWithRange(1, 128),
    bankName: allCharsWithRange(1, 128),
    branchName: allCharsWithRange(1, 128),
    first_name: allCharsWithRange(1, 128), //facebook return param
    last_name: allCharsWithRange(1, 128), //facebook return param
    emailNotify: boolean,
    mobileNotify: boolean,
    currency: /^[a-z]{3}$/i,
    username: /^.{2,128}$/,
    password: /^.{6,512}$/,
    accessCode: /^[0-9a-fA-F]{8,16}$/,
    hashSecret: /^[\S]{1,256}$/,
    terminalKey: /^[\S]{1,256}$/,
    fingerPrint: /^[\S]{6,50}$/,
    state: /^([A-Za-z]+ ?){1,3}$/,
    statusMSG: /^(Queued|Sent|Failed|Rejected)$/,
    DLR: /^(Delivered|Undeliverable)$/,
    MessageID: /^[1-9][0-9]{9}$/,
    pageNum: /^(-1|[0-9]{1,5})$/,
    ageFrom: /^([0-9]{1,2})$/,
    ageTo: /^([0-9]{1,2})$/,
    numberOfTransaction: /^([0-9]{1,5})$/,
    merchantPercent: percent,
    userPercent: percent,
    acquirerPercent: percent,
    acquirerFixed: percent,
    settlementPercent: percent,
    defaultOfferFees: percent,
    offerFees: percent,
    smsFees: percent,
    emailFees: percent,
    branchMonthlyFees: /^[1-9][0-9]{1,4}$/,
    reqIp: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    country: /^[A-Za-z]{3,50}$/, //allCharsWithRange(1, 128),
    // iso: /^[A-Z]{2}$/,
    countryIso3: /^[A-Z]{3}$/,
    nationalityIso3: /^[A-Z]{3}$/,
    countryNiceName: /^[A-Za-z]+[\s\S]*[A-Za-z]*$/,
    nationalityNiceName: /^[A-Za-z]+[\s\S]*[A-Za-z]*$/,
    numcode: /^[0-9]{1,3}$/,
    phonecode: /^[0-9]{1,4}$/,
    businessCountry: allCharsWithRange(1, 128),
    cardNum: /^[0-9]{6}[0-9\*]{3,9}[0-9]{4}$/,
    cardExp: /^(1[8-9]|2[0-9])(0[1-9]|1[0-2])$/,
    cardCVC: /^[0-9]{2,4}$/,
    holderName: /^.{1,128}$/,
    validationCode: /^[0-9]{6}$/,
    branch: allCharsWithRange(1, 100),
    accountNumber: /^[0-9]{1,128}$/,
    status: /^(0|1|2|3|4|null|approved|false|true|pending|settled|claim)$/,
    sorting: /^(0|1)$/,
    dateValidation: /^([1][9]|[2][0])[0-9]{2}(-|\/)([1][0-2]|[1-9]{1}|[0][1-9])(-|\/)([3][0-1]|[2][0-9]|[1][0-9]|[0][1-9]|[1-9])$/,
    birthdate: /^([1][9]|[2][0])[0-9]{2}(-|\/)([1][0-2]|[1-9]{1}|[0][1-9])(-|\/)([3][0-1]|[2][0-9]|[1][0-9]|[0][1-9]|[1-9])$/,
    month: /^[1][0-2]|[1-9]{1}|[0][1-9]$/,
    year: /^([1][9]|[2][0])[0-9]{2}$/,
    street: /^.{1,255}$/,
    apartment: /^[0-9]{1,3}$/,
    long: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
    lat: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
    postalCode: /^^[1-9]\d{4}$/,
    // lat: /^\d{1,3}\.{1}\d{1,20}$/,
    firstName: allCharsWithRange(1, 80),
    lastName: allCharsWithRange(1, 80),
    name: allCharsWithRange(1, 128),
    brandImage: /^.*\.(jpg|jpeg|gif|JPG|png|PNG)$/,
    image: /^(.*\.(jpg|jpeg|gif|JPG|png|PNG))$/,
    fileName: /^.*\.(jpg|jpeg|gif|JPG|png|PNG|pdf|PDF|csv|CSV)$/,
    storeCover: /^(.*\.(jpg|jpeg|gif|JPG|png|PNG))$/,
    images: imagesArray,
    couponImages: imagesArray,
    offerImages: imagesArray,
    redeemProductImages: imagesArray,
    // image: /^[\S]{3,500}$/,
    stock: /^[0-9]{1,5}$/,
    adminPassword: adminPassword,
    fromAge: /^[0-9]{1,2}$/,
    toAge: /^[0-9]{1,2}$/,
    gender: /^(all|male|female)$/,
    orderDirection: /^(asc|desc)$/i,
    imageSize: /^(large|small)$/i,
    value: /^\w{2,16}|[0-9]{7,15}|email $/,
    newPassword: /^.{6,35}$/,
    verifiedCode: /^[0-9]{6}$/,
    exeTime: /^[0-9]{0,1000000}$/,
    hashSecretOld: /^[\S]{1,256}$/,
    source: /^[a-zA-Z]{3,40}$/,
    type: /^[a-zA-Z]{3,40}$/,
    serviceType: /^[a-zA-Z]{3,40}$/,
    filterTransaction: /^(app|offer|website|terminal|store)$/i,
    scheduledPeriodType: /^(week|month|quarter|half|year)$/i,
    scheduledPeriodValue: /^(3[0-1]|2[0-9]|1[0-9]|[1-9])([0][1-9]|1[0-2])|3[0-1]|2[0-9]|1[0-9]|[1-9]|(true)$/,
    routingNumber: /^\d{8,12}$/,
    city: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
    maxMeters: /^[1-9]\d{0,9}$/,
    role: allCharsWithRange(1, 128),
    roleName: /^[a-zA-Z\s]{3,40}$/,
    defaultState: /^[a-zA-Z/.]{3,40}$/,
    actionType: /^(sales|views|clicks|amount|requests)$/i,
    chartType: /^(transactions|amount|users|)$/i,
    MIDText: /^[0-9a-zA-Z]{3,40}$/, // login on merchant to decide
    brandImageNativeName: /^.*\.(jpg|jpeg|gif|JPG|png|PNG)$/,
    uploadScanFileName: /^.*\.(jpg|jpeg|gif|JPG|png|PNG)$/,
    groupName: /^(agreement)$/i,
    registerNumber: /^.{1,128}$/,
    registerScan: /^.*\.(jpg|jpeg|gif|JPG|png|PNG|pdf|PDF)$/,
    taxesScan: /^.*\.(jpg|jpeg|gif|JPG|png|PNG|pdf|PDF)$/,
    aptsuite: /^[\d\w]{1,128}$/,
    postal: /^[1-9]\d{4}$/, //group it
    language: /^(English|عربى)$/,
    offerType: /^(offer|loyalty|offerPoint|offerMoney|gift|coupon|loyaltyPercent|loyaltyProduct|loyaltyCashback)$/i,
    offer: /^(offerMoney|offerPoint|loyaltyCashback|loyaltyPercent|loyaltyProduct)$/i,
    accountType: /^(gift|coupon|loyaltyProduct|loyaltyPercent|loyaltyCashback|wallet|card|balance)$/i,
    businessType: /^(Retail|Medical|Online|other)$/i,
    'countries.nicename': /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
    'countries.iso3': /^[a-zA-Z]{2,3}$/,
    key: /^[a-zA-Z0-9]{2,16}$/,
    acquirer: allCharsWithRange(1, 500),
    midAcquirer: /^(AAIB|BM)$/,
    midCurrency: /^(EGP|USD)$/,
    acquirerName: allCharsWithRange(1, 500),
    arrayOfTransactionId: uuidArray,
    dateOfBirth: isDateOfBirth,
    identificationList: allCharsWithRange(1, 500),
    legalFirstName: allCharsWithRange(1, 500),
    legalLastName: allCharsWithRange(1, 500),
    nationality: allCharsWithRange(1, 500),
    uploadScanFile: allCharsWithRange(1, 500),
    uploadScanFileNativeName: allCharsWithRange(1, 500),
    acceptAgreement: boolean,
    refranceNum:/^[0-9]{6}$/,
    settlementType: /^(transaction|offer)$/i,
    NFCId: /^[0-9]{16,32}$/,
    contactSource: /^(local|google|linkedin|facebook)$/,
    itemType: /^(offerMoney)$/,

    //campaign
    campaignId: uuid,
    campaignName: allCharsWithRange(1, 200),
    audience: allCharsWithRange(1, 200),
    userAgeFrom: age,
    userAgeTo: age,
    userGender: /^(male|female|all)$/i,
    action: /^(review|delete)$/i,
    countryTarget: /^(country|nationality)$/i,
    userRegion: allCharsWithRange(1, 500),
    socialClass: CharArray,
    catchPoint: /^(vapulusApp|sms|email|socialMedia)$/i,
    repeatIndex: /^[1-9][0-9]{0,1}$/,
    repeatInterval: /^(week|month|year)$/i,
    getBy: /^(days|week|month|year)$/i,
    repeatNumber: /^[0-9]{1}$/,
    Description: allCharsWithRange(1, 500),
    deliveryTerms: allCharsWithRange(1, 10000),
    PaRes: allCharsWithRange(1, 10000),
    platform: /^(ios|android)$/,
    appVersion: /^[0-9]+\.?[0-9]*$/,
    paymentMethod:/^(card|balance|madfooatcom)$/,
    paymentType:/^(card|balance|madfooatcom)$/,
    items: items,
    invoiceDetails: invoiceDetail,
    fbCode: allCharsWithRange(1, 1024),
    fbCsrf: allCharsWithRange(1, 1024),

    POSIds: function (posIds) {
        try {
            if (typeof posIds == 'object' && posIds.length == 1)
                posIds = "[" + "\"" + posIds + "\"" + "]"
            posIds = JSON.parse(posIds);

        } catch (err) { }
        if (typeof (posIds) == 'object' && posIds.length > 0) {
            for (var i in posIds) {
                if (!allCharsWithRange(0, 128).test(posIds[i]))
                    return false;
            }
            return true;
        } else if (allCharsWithRange(0, 128).test(posIds)) {
            return true;
        } else {
            return false;
        }
    },
    mobileNumberArray: function (mobileNum) {
        try {
            mobileNum.toString()
            mobileNum = JSON.parse(mobileNum);
        } catch (err) { }
        if (typeof (mobileNum) == 'object' && mobileNum && mobileNum.length > 0) {
            for (var i in mobileNum) {
                if (!new RegExp(mobileStore).test(mobileNum[i]))
                    return false;
            }
            return true;
        } else if (new RegExp(mobileStore).test(mobileNum)) {
            return true;
        } else {
            return false;
        }
    },
    emailArray: function (emails) {
        try {
            emails = JSON.parse(emails);
        } catch (err) { }
        if (typeof (emails) == 'object' && emails && emails.length > 0) {
            for (var i in emails) {
                if (!new RegExp(email).test(emails[i]))
                    return false;
            }
            return true;
        } else if (new RegExp(email).test(emails)) {
            return true;
        } else {
            return false;
        }
    },
    mobileData: function (moobData) {
        try {
            moobData = JSON.parse(moobData);
        } catch (err) {
            moobData = moobData;
        }
        if (typeof (moobData) == 'object' && moobData.length > 0) {
            for (var i in moobData) {
                for (var j in moobData[i]) {
                    if (!allCharsWithRange(0, 500).test(moobData[i][j]))
                        return false;
                }
            }
            return true;
        } else
            return false;
    },
    siteButtonValidation: {
        "id": {
            type: 'string',
            required: true
        },
        "name": {
            type: 'string',
            required: true
        },
        "style": [{
            "display": {
                type: 'string',
                required: false
            },
            "line-height": {
                type: 'string',
                required: false
            },
            "height": {
                type: 'string',
                required: false
            },
            "margin": {
                type: 'string',
                required: false
            },
            "min-width": {
                type: 'string',
                required: false
            },
            "text-align": {
                type: 'string',
                required: false
            },
            "cursor": {
                type: 'string',
                required: false
            },
            "border-radius": {
                type: 'string',
                required: false
            },
            "color": {
                type: 'string',
                required: false
            },
            "font-weight": {
                type: 'string',
                required: false
            },
            "font-size": {
                type: 'string',
                required: false
            },
            "padding": {
                type: 'string',
                required: false
            },
            "white-space": {
                type: 'string',
                required: false
            },
            "border": {
                type: 'string',
                required: false
            },
            "background": {
                type: 'string',
                required: false
            },
            "width": {
                type: 'string',
                required: false
            }
        }]
    },

    merchantRoleValidation: [{
        "name": {
            type: 'string',
            required: true
        },
        "actions": [{
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        }
        ]
    },
    {
        "name": {
            type: 'string',
            required: true
        },
        "actions": [{
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        }
        ]
    },
    {
        "name": {
            type: 'string',
            required: true
        },
        "actions": [{
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        }
        ]
    },
    {
        "name": {
            type: 'string',
            required: true
        },
        "actions": [{
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        }
        ]
    },
    {
        "name": {
            type: 'string',
            required: true
        },
        "actions": [{
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        }
        ]
    },
    {
        "name": {
            type: 'string',
            required: true
        },
        "actions": [{
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        }
        ]
    },
    {
        "name": {
            type: 'string',
            required: true
        },
        "actions": [{
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        }
        ]
    },
    {
        "name": {
            type: 'string',
            required: true
        },
        "actions": [{
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        },
        {
            "name": {
                type: 'string',
                required: true
            },
            "access": {
                type: 'boolean',
                required: true
            }
        }
        ]
    }
    ],
    itemsValidation: {
        "title": {
            type: 'string',
            required: true
        },
        "price": {
            required: true
        },
        "quantity": {
            required: true
        },
    }
};