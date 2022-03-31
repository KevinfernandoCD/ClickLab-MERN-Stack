
/*FIRST WE CREATE THJE ERORR WITH A TEXT USING THE NOTFOUND 
METHOD/FUNCTION BELOW*/
const notFound  = (req,res,next) => {

    const error =  new Error(`Not Found,Inavalid URL - ${req.originalUrl}`);
    res.status(404);

    //PARSE THE ERROR TEXT THROUGH THE NEXT() TO THE NEXT MIDDLEWARE
    next(error);
}


/*HANDLING THE ERROR WHICH WE CREATED ABOVE USING
THE ERROR HANDLER METHOD WE CREATE BELOW AND
SENDING IT TO THE CLIENT SIDE USING A JSON OBJ*/

const errorHandler = (err,req,res,next) => {

    const statusCode = err.status || 500;

    res.status(statusCode);

    res.json({message:err.message,stack:err.stack});
    

}

module.exports = {notFound,errorHandler};