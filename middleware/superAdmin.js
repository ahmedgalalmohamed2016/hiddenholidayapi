exports.superAdminAuth = async function (req, res, next) {
    if (req.userData.role == 'superAdmin')
        return next()
    else
        return res.status(403).send({statusCode:401,message:"You dont have authority to access this page"});
}