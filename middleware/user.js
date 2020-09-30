exports.userAuth = async function(req, res, next) {
    console.log(req.userData.role);
    if (req.userData.role != 'user')
        return res.status(401).send({statusCode:401,message:"You dont have authority to access this page"});
    return next()
}