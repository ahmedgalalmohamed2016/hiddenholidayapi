exports.superAdminAuth = async function (req, res, next) {
    if (req.userData.role == 'superAdmin')
        return next()
    else
        return res.status(403).send("You dont have authority to access this page");
}