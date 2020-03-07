exports.adminAuth = async function(req, res, next) {
    if (req.userData.role == 'admin' || req.userData.role == 'superAdmin' || req.userData.role == 'merchant' ||
        req.userData.role == 'merchantAdmin')
        return next()
    else
        return res.status(401).send("You dont have authority to access this page");
}