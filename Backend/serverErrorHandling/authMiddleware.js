const jwt = require("jsonwebtoken");
const userMod = require("../Models/userModel");
const asyncHandler = require("express-async-handler"); 


const authUserTokenId = asyncHandler(async (req,res,next) => {

    let token;

    /*SO WHEN WE SEND THE REQUEST FROM OUR
    CLIENT SIDE WE STORE OUR TOKEN INSIDE OF THE REQ,HEADERS 
    OBJ AND WE ADD "BEARER KEYWORD TO MAKE IT SPECIFIC
    SO THE ONLY LOGGED IN USER CAN ACCESS IT"*/

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

        try {

            //REMOVE THE "BEARER" KEYWORD WE ADDDED DURING THE REQUEST

            token = req.headers.authorization.split(" ")[1];

            //THEN WE DECODE THE TOKEN BY USING JWT.VERIFY NOTE THAT THIS TAKES THE TOKEN SECRET THAT WE ADDED WHEN CREATING THE TOKEN
            //THIS RETURNS US THE ID WHICH WE USED ORIGINALLY TO CREATE THE TOKEN
            const decodedToken = jwt.verify(token,"click_lab_jwt_token_secret");

            /*GET THE USER MEDOL FROM DATABASE 
            USING THE ID AND STORE IT IN THE REQ.USER OBJ WITHOUT THE PASSWORD*/
            req.user = await userMod.findById(decodedToken.id).select("-password");

            next();

            
        } catch (error) {

            res.status(401);
            throw new Error("Unauthorized User");

            
        }
    }

    if(!token){
        res.status(401);
        throw new Error("Unauthorized, No token found");
    }

});

module.exports = {authUserTokenId};