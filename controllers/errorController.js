module.exports =(err,req,res,next)=>{
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status? err.status: (err.code || 'error');
    res.status(err.statusCode).send({
        status:err.status,
        msg:err.message

    })
}