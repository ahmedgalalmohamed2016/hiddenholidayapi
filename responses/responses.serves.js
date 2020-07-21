module.exports = {
    response:(res,err,succ)=>{
        if(err)
        return res.send({statusCode:404,message:err})
        return res.send({statusCode:200,message:"success",data:succ})
    }
}