exports.adminAuth = async function(req, res, next) {
    console.log("-------");
    if (req.userData.role == 'admin' || req.userData.role == 'superAdmin')
        return next()
    else
        return res.status(401).send("You dont have authority to access this page");
}