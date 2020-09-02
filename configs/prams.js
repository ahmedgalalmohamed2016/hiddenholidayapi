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
    "merchants_merchantsById": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_merchantById": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_admin_merchantsById": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_me_merchantsById": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_me": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_balance": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_me_totalDeals": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_me_update": {
        "mauth": true,
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
        "userDevice": true
    },
    "merchants_admin_create": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_create": {
        "mauth": true,
        "userDevice": true
    },
    "merchants_admin_update": {
        "mauth": true,
        "userDevice": true
    },

    // ---------------------------------------------------------------

    //merchant routs ---------------------------------------------------
    'user_register': {
        "mauth": true,
        "userDevice": true
    },
    'user_login': {
        "mauth": true,
        "userDevice": true
    },
    'user_login_admin': {
        "mauth": true,
        "userDevice": true
    },
    'user_logout': {
        "mauth": true,
        "userDevice": true
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
        "mauth": true,
        "userDevice": true
    },
    'user_verifyForgetPassword': {
        "mauth": true,
        "userDevice": true
    },
    'user_changePassword': {
        "mauth": true,
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
        "userDevice": true
    },
    'api_deals_admin_merchant': {
        "mauth": true,
        "userDevice": true
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
    'api_deals_admin_deal': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_merchants_me_active': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_merchants_me_delivery': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_user_me': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_UserDealRequests': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_merchant_me': {
        "mauth": true,
        "userDevice": true
    },
    'api_deals_request': {
        "mauth": true,
        "userDevice": true
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
        "userDevice": true
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
        "userDevice": true
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

    //api/categories routs ---------------------------------------------

    'api_categories/list': {
        "mauth": true,
        "userDevice": true
    },
    'api_categories/upload': {
        "mauth": true,
        "userDevice": true
    },
    'api_categories/admin/create': {
        "mauth": true,
        "userDevice": true
    },
    'api_categories/admin/list': {
        "mauth": true,
        "userDevice": true
    },
    'api_categories/admin/category': {
        "mauth": true,
        "userDevice": true
    },
    'api_categories/admin/update': {
        "mauth": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------

    //api/categories routs ---------------------------------------------
    'api_transactions/admin/list': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions/merchant/me': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions/admin/merchant': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions/details': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions/user/me': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions/main': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions/user': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions/merchant/balance': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions/user/bill/request': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions/merchant/bill': {
        "mauth": true,
        "userDevice": true
    },
    'api_transactions/merchant/bill/update': {
        "mauth": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------


    //api/cards routs ------------------------------------------------
    'api_cards/user/add': {
        "mauth": true,
        "userDevice": true
    },
    'api_cards/merchant/add': {
        "mauth": true,
        "userDevice": true
    },
    'api_cards/user/get': {
        "mauth": true,
        "userDevice": true
    },
    'api_cards/user/remove': {
        "mauth": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------

    //api/wallet routs ------------------------------------------------
    'api_wallet/user/cashin': {
        "mauth": true,
        "userDevice": true
    },
    'api_wallet/merchant/cashin': {
        "mauth": true,
        "userDevice": true
    },
    'api_wallet/admin/merchant/balance': {
        "mauth": true,
        "userDevice": true
    },
    'api_wallet/main/balance': {
        "mauth": true,
        "userDevice": true
    },
    'api_wallet/merchant/balance': {
        "mauth": true,
        "userDevice": true
    },
    'api_wallet/merchant/summary': {
        "mauth": true,
        "userDevice": true
    },
    'api_wallet/main/subwallets': {
        "mauth": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------

    //api/bids routs ------------------------------------------------
    'api_bids/admin/create': {
        "mauth": true,
        "userDevice": true
    },
    'api_bids/admin/update': {
        "mauth": true,
        "userDevice": true
    },
    'api_bids/admin/list': {
        "mauth": true,
        "userDevice": true
    },
    'api_bids/admin/bid': {
        "mauth": true,
        "userDevice": true
    }, 'api_bids/': {
        "mauth": true,
        "userDevice": true
    },
    'api_bids/admin/merchant': {
        "mauth": true,
        "userDevice": true
    },
    'api_bids/usebid': {
        "mauth": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------

    //api/merchantAdmin routs ----------------------------------------
    'api/merchantAdmin/changePassword': {
        "mauth": true,
        "userDevice": true
    },
    'api/merchantAdmin/users': {
        "mauth": true,
        "userDevice": true
    },
    'api/merchantAdmin/create': {
        "mauth": true,
        "userDevice": true
    },
    'api/merchantAdmin/getUser': {
        "mauth": true,
        "userDevice": true
    },
    'api/merchantAdmin/getmerchants': {
        "mauth": true,
        "userDevice": true
    },
    'api/merchantAdmin/update': {
        "mauth": true,
        "userDevice": true
    },
    'api/merchantAdmin/create/user': {
        "mauth": true,
        "userDevice": true
    },
    'api/merchantAdmin/list/user': {
        "mauth": true,
        "userDevice": true
    },
    // ---------------------------------------------------------------


    //api/ealb -------------------------------------------------------
    'api/ealb/changePassword': {
        "mauth": true,
        "userDevice": true
    },
    'api/ealb/users': {
        "mauth": true,
        "userDevice": true
    },
    'api/ealb/create': {
        "mauth": true,
        "userDevice": true
    },
    'api/ealb/getUser': {
        "mauth": true,
        "userDevice": true
    },
    'api/ealb/update': {
        "mauth": true,
        "userDevice": true
    }
    // ---------------------------------------------------------------
};