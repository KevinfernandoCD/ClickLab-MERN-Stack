/*TO GET A WEB TOKEN YOU NEED A PAKAGE CALL JASON WEB TOKEN*/ 
const jwt = require("jsonwebtoken");

const generateToken = (id) => {

    /*JWT.SIGN TAKES 3 THINGS THE ID,A SECRET AND HOW MUCH TIME IT TAKES TO EXPIRE THIS TOKEN*/

    return jwt.sign({id},"click_lab_jwt_token_secret",{expiresIn:"30d"})


}
module.exports = generateToken;