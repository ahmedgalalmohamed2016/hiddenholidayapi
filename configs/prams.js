module.exports.params = {
    '_': {
        "mauth": true,
        "userDevice": true
    },
    //public routs ---------------------------------------------------
    "api_deals": {
        "authorization": true
    },
    // ---------------------------------------------------------------

    //admin routs ----------------------------------------------------
    "api_admin_merchants": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_log": {
        "mauth": true,
        "userDevice": true,
        "pageNum": true
    },
    "api_admin_deals": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_bids": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_dashboard": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_deals_create": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_bids_create": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_changePassword": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_users": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_create": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_getUser": {
        "mauth": true,
        "id":true,
        "userDevice": true
    },
    "api_admin_update": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_merchant_transactions_notSettled": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_merchant_transactions_settled": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_allMerchants_sattlementAmount": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_merchants_sattlementAmount": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_transactions_settle": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_transactions_settlement": {
        "mauth": true,
        "userDevice": true
    },
    "api_admin_merchant_banckAcount": {
        "mauth": true,
        "userDevice": true
    },

    // ---------------------------------------------------------------

    //merchant routs ---------------------------------------------------
    "merchants_home": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_card_add": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_fund_add": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_card_get": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_card_remove": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_checkPassword": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_maps": {
        "mauth": true,
        "userDevice": true
    },
    "madfooatcom":{},
    "madfooatcom_refrance_detail":{
        "refranceNum":true
    },

    "merchants_merchantById": {
        "mauth": true,
        "id":true,
        "merchantId":false,
        "userDevice": true
    },
    "merchants_admin_merchantsById": {
        "mauth": true,
        "userDevice": true,
        "id":true,
    },
    "merchants_me_merchantsById": {
        "mauth": true,
        "userDevice": true,
        "merchantId": true
    },
    "merchants_me": {
        "mauth": true,
        "merchantId":false,
        "userDevice": true
    },
    "merchants_balance": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_me_totalDeals": {
        "mauth": true,
        "merchantId":false,
        "userDevice": true
    },
    "merchants_me_update": {
        "mauth": true,
        "merchantId":false,
        "userDevice": true
    },
    "merchants": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_favourites": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_merchantsById_list": {
        "mauth": true,
        "userDevice": true,
        "id": true,
        "merchantId": true
    },
    "merchants_admin_create": {
        "mauth": true,
        "userDevice": true,
        "address": true,
"cat_name": true,
'category': true,
"categoryId": true,
"clean_name": true,
"country": true,
"emails": true,
"firstName": true,
"lastName": true,
"main_phone_number": true,
"mobileNumber": true,
"name": true,
"password":true,
"userId": true,
    },
    "merchants_create": {
        "mauth": true,
        "userDevice": true,
        "address": true,
        "category": true,
        "categoryId": true,
        "clean_name": true,
        "country": true,
        "emails": true,
        "firstName": true,
        "lastName": true,
        "main_phone_number": true,
        "mauth": true,
        "mobileNumber": true,
        "name": true,
        "password": true,
        "userDevice": true,
    },
    "merchants_admin_update": {
        "mauth": true,
        "userDevice": true
    },

    // ---------------------------------------------------------------

    //merchant routs ---------------------------------------------------
    "user_verifyForgetPassword": {
        "code": true,
        "mobileNumber": true,
        "newPassword": true
    },
    'user_register': {
        "country": true,
        "firstName": true,
        "lastName": true,
        "mobileNumber": true,
        "password": true
    },
    'user_login': {
        "username": true,
        "password": true
    },
    'user_login_admin': {
        password: true,
        username: true
    },
    'user_logout': {
        "mauth": true,
        "userDevice": true,
    },
    'user_updatesocket': {
        "mauth": true,
        "userDevice": true
    },
    'user_countries': {
        "mauth": true,
        "userDevice": true
    },
    'user_categories': {
        "mauth": true,
        "userDevice": true
    },
    'user_balance': {
        "mauth": true,
        "userDevice": true
    },
    'user_card_get': {
        "mauth": true,
        "userDevice": true
    },
    'user_checkPassword': {
        "mauth": true,
        "userDevice": true
    },
    'user_admin_changePassword': {
        "mauth": true,
        "userDevice": true
    },
    'user_admin_users': {
        "mauth": true,
        "userDevice": true
    },
    'user_admin_create': {
        "mauth": true,
        "userDevice": true
    },
    'user_admin_getUser': {
        "mauth": true,
        "id":true,
        "userDevice": true
    },
    'user_admin_update': {
        "mauth": true,
        "userDevice": true
    },
    'user_profile': {
        "mauth": true,
        "userDevice": true
    },
    'user_profileEdite': {
        "mauth": true,
        "userDevice": true
    },
    'user_verifyPhone': {
        "code": true,
        "mauth": true,
        "userDevice": true
    },
    'user_verifyPhone_resendSms': {
        "mauth": true,
        "userDevice": true
    },
    'user_login_facebook': {
        "mauth": true,
        "userDevice": true
    },
    'user_forgetPassword': {
        "mobileNumber": true
    },
    'user_verifyForgetPassword': {
    },
    'user_changePassword': {
        "mauth": true,
        "newPassword": true,
        "password": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------


    //bank routs -----------------------------------------------------

    'api_bank_create': {
        "mauth": true,
        "userDevice": true
    },
    'api_bank_details': {
        "mauth": true,
        "userDevice": true
    },
    'api_bank_delete': {
        "mauth": true,
        "userDevice": true
    },
    'api_bank_merchant_list': {
        "mauth": true,
        "userDevice": true
    },

    // ---------------------------------------------------------------

    //merchant_user routs --------------------------------------------
    'merchant_user_assign': {
        "mauth": true,
        "userDevice": true
    },
    'merchant_user_me': {
        "mauth": true,
        "userDevice": true
    },
    'merchant_user_deals': {
        "mauth": true,
        "userDevice": true
    },
    'merchant_user_deals_update': {
        "mauth": true,
        "userDevice": true
    },
    'merchant_user_': {
        "mauth": true,
        "userDevice": true
    },

    // ---------------------------------------------------------------

    //api_deals routs ------------------------------------------------
    'api_deals': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_bids': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_cart': {
        "mauth": true,
        "ids":true,
        "userDevice": true
    },
    'api_deals_admin_merchant': {
        "mauth": true,
        "userDevice": true,
        "id":true,
        "merchantId":true
    },
    'api_deals_public_merchant': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_public_merchant_bids': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_me_deal': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_merchant_deal': {
        "mauth": true,
        "userDevice": true
    },

    'deals_admin_deal': {
        "mauth": true,
        "userDevice": true,
        "id":true,
    },
    'api_deals_admin_deal': {
        "mauth": true,
        "userDevice": true,
        "merchantId": true
    },
    'merchants':{},
    'api_deals_merchants_me_active': {
        "merchantId":true,
        "mauth": true,
        "userDevice": true
    },
    'api_deals_merchants_me_delivery': {
        "mauth": true,
        "merchantId":false,
        "userDevice": true,
        "merchantId": true
    },
    'api_deals_user_me': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_UserDealRequests': {
        "isUsed": true,
        "mauth": true,
        "pageNumber": true,
        "type": true,
        "userDevice": true
    },
    'api_deals_merchant_me': {
        "mauth": true,
        "merchantId":true,
        "userDevice": true
    },
    'api_deals_request': {
        "mauth": true,
        "userDevice": true,
        "cardId": false,
        "data": true,
        "paymentMethod": true,
        "paymentType": true,
    },
    'api_deals_request_details': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_useDeal': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_history': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_merchant_create': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_merchant_create_bid': {
        "mauth": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------


    //api_admin routs ------------------------------------------------

    'api_admin_merchants': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_bids': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_dashboard': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_deals_create': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_bids_create': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_changePassword': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_users': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_create': {
        "mauth": true,
        "userDevice": true,
        "country": true,
"firstName": true,
"lastName": true,
"mobileNumber": true,
"password": true,
"userDevice": true,
    },
    'api_admin_getUser': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_update': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_merchant_transactions_notSettled': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_merchant_transactions_settled': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_allMerchants_sattlementAmount': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_merchants_sattlementAmount': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_transactions_settle': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_transactions_settlement': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_merchant_banckAcount': {
        "mauth": true,
        "userDevice": true
    },
    'api_admin_merchant_banckAcount_delete': {
        "mauth": true,
        "userDevice": true,
        "id":true,
        "isDeleted":true
    },

    // ---------------------------------------------------------------


    //api_countries routs ---------------------------------------------

    'api_countries_list': {
        "mauth": true,
        "userDevice": true
    },
    'api_countries_list_all': {
        "mauth": true,
        "userDevice": true
    },
    'api_countries_admin_create': {
        "mauth": true,
        "userDevice": true
    },
    'api_countries_admin_list': {
        "mauth": true,
        "userDevice": true
    },
    'api_countries_admin_country': {
        "mauth": true,
        "userDevice": true
    },
    'api_countries_admin_update': {
        "mauth": true,
        "userDevice": true
    },


    // ---------------------------------------------------------------

    //api_packages routs ---------------------------------------------

    'api_packages_list': {
        "mauth": true,
        "userDevice": true
    },
    'api_packages_upload': {
        "mauth": true,
        "userDevice": true
    },
    'api_packages_admin_create': {
        "mauth": true,
        "userDevice": true,
        "arDescription": true,
"arName": true,
"enDescription": true,
"enName": true,
"isActive": true,
"maxBidRequests": true,
"maxBids": true,
"maxDealRequests": true,
    },
    'api_packages_admin_list': {
        "mauth": true,
        "userDevice": true
    },
    'api_packages_admin_package': {
        "mauth": true,
        "userDevice": true
    },
    'api_packages_admin_update': {
        "mauth": true,
        "userDevice": true
    },

    // ---------------------------------------------------------------

    //api_categories routs ---------------------------------------------

    'api_categories_list': {
        "mauth": true,
        "userDevice": true
    },
    'api_categories_upload': {
        "mauth": true,
        "userDevice": true
    },
    'api_categories_admin_create': {
        "mauth": true,
        "userDevice": true
    },
    'api_categories_admin_list': {
        "mauth": true,
        "userDevice": true
    },
    'api_categories_admin_category': {
        "mauth": true,
        "id":true,
        "userDevice": true
    },
    'api_categories_admin_update': {
        "mauth": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------

    //api_categories routs ---------------------------------------------
    'api_transactions_admin_list': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions_merchant_me': {
        "mauth": true,
        "merchantId":false,
        "userDevice": true
    },
    'api_transactions_admin_merchant': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions_details': {
        "mauth": true,
        "userDevice": true,
        "id":true
    },
    'api_transactions_user_me': {
        "mauth": true,
        "pageNumber": true,
        "userDevice": true
    },
    'api_transactions_main': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions_user': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions_merchant_balance': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions_user_bill_request': {
        "mauth": true,
        "userDevice": true,
        "amount": true,
        "cardId": false,
        "merchantId": true,
        "paymentMethod": true,
        "paymentType": true,
    },
    'api_transactions_merchant_bill': {
        "mauth": true,
        "userDevice": true,
        "merchantId": false,
        "status": false
    },
    'api_transactions_merchant_bill_update': {
        "mauth": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------


    //api_cards routs ------------------------------------------------
    'api_cards_user_add': {
        "cardNumber": true,
        "expireMonth": true,
        "expireYear": true,
        "holderName": true,
        "mauth": true,
        "userDevice": true
    },
    'api_cards_merchant_add': {
        "mauth": true,
        "userDevice": true
    },
    'api_cards_user_get': {
        "mauth": true,
        "userDevice": true
    },
    'api_cards_user_remove': {
        "mauth": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------

    //api_wallet routs ------------------------------------------------
    'api_wallet_user_cashin': {
        "mauth": true,
        "userDevice": true,
        "amount": true,
        "country": false,
        "cardId": false,
        "paymentMethod": true
    },
    'api_wallet_merchant_cashin': {
        "mauth": true,
        "userDevice": true,
        "amount": true,
        "country": false,
        "cardId": false,
        "paymentMethode": true
    },
    'api_wallet_admin_merchant_balance': {
        "mauth": true,
        "userDevice": true,
        "id":true,
        "merchantId":true
    },
    'api_wallet_main_balance': {
        "mauth": true,
        "userDevice": true
    },
    'api_wallet_merchant_balance': {
        "mauth": true,
        "userDevice": true
    },
    'api_wallet_merchant_summary': {
        "mauth": true,
        "userDevice": true
    },
    'api_wallet_main_subwallets': {
        "mauth": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------

    //api_bids routs ------------------------------------------------
    'api_bids_admin_create': {
        "mauth": true,
        "userDevice": true
    },
    'api_bids_admin_update': {
        "mauth": true,
        "userDevice": true
    },
    'api_bids_admin_list': {
        "mauth": true,
        "userDevice": true
    },
    'api_bids_admin_bid': {
        "mauth": true,
        "userDevice": true
    }, 'api_bids_': {
        "mauth": true,
        "userDevice": true
    },
    'api_bids_admin_merchant': {
        "mauth": true,
        "userDevice": true,
        "id":true,
        "merchantId":true
    },
    'api_bids_usebid': {
        "mauth": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------

    //api_merchantAdmin routs ----------------------------------------
    'api_merchantAdmin_changePassword': {
        "mauth": true,
        "userDevice": true
    },
    'api_merchantAdmin_users': {
        "mauth": true,
        "userDevice": true
    },
    'api_merchantAdmin_create': {
        "mauth": true,
        "userDevice": true
    },
    'api_merchantAdmin_getUser': {
        "mauth": true,
        "userDevice": true,
        "id":true
    },
    'api_merchantAdmin_getmerchants': {
        "mauth": true,
        "id":true,
        "userDevice": true
    },
    'api_merchantAdmin_update': {
        "mauth": true,
        "userDevice": true
    },
    'api_merchantAdmin_create_user': {
        "mauth": true,
        "userDevice": true
    },
    'api_merchantAdmin_list_user': {
        "mauth": true,
        "merchantId":true,
        "userDevice": true
    },
    // ---------------------------------------------------------------


    //api_ealb -------------------------------------------------------
    'api_ealb_changePassword': {
        "mauth": true,
        "userDevice": true,
        "id": true,
        "password": true,
    },
    'api_ealb_users': {
        "mauth": true,
        "userDevice": true
    },
    'api_ealb_create': {
        "mauth": true,
        "userDevice": true
    },
    'api_ealb_getUser': {
        "mauth": true,
        "userDevice": true
    },
    'api_ealb_update': {
        "mauth": true,
        "userDevice": true,
        "country": true,
"email": true,
"firstName": true,
"id": true,
"isLockedOut": true,
"lastName": true,
"mobileNumber": true
    }
    // ---------------------------------------------------------------
};