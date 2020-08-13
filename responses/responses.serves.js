module.exports = {
    response:(res,err,succ)=>{
        if(err)
        return res.status(404).send({ statusCode: 404,message:err})
        return res.status(200).send({ statusCode: 200,message:"success",data:succ})
    }
}