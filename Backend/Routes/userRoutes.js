const express = require('express');
const {registerUser,logUser,getAllUsers} = require('../controllers/userControllers');
const {authUserTokenId} = require("../serverErrorHandling/authMiddleware")
const router = express.Router();

//SETTING UP THE MIDDLEWARES WITH THE FUNCTIONS
//SIGNUP ROUTE
router.route('/').post(registerUser);
//THIS IS A ANOTHER WAY OF DOING WHAT WE HAVE DONE ABOVE

//LOGIN ROUTE
router.route('/login').post(logUser);

//USER SEARCH ROUTE
router.route("/").get(authUserTokenId,getAllUsers);


module.exports = router;