const asyncHandler = require("express-async-handler");

const userMod = require('../Models/userModel')

const generateToken = require("../config/generateToken");
const res = require("express/lib/response");

//THE ASYNC HANDLER IS A PAKAGE TO CATCH ERROS IN ASYNC FUNCTIONS   
const registerUser = asyncHandler(async (req,res) => {

    const {name,email,password,gender,dp} = req.body;

    if(!name || !email || !password || !gender){

        res.status(400);
        throw new Error("Please fill the required feilds")
    }

    //CHECK WHEATHER THE USER ALREADY EXIST IN THE DATABASE
    const alreadyRegistered = await userMod.findOne({email:email});

    if(alreadyRegistered){
        res.status(404);
        throw new Error("User Already Exist");

    }

    const user = await userMod.create({name,email,password,gender,dp})

//SO IF THE SERVER CREATED THE USER SUCCESSFULLY THEN SEND THE USER BACK A NEW OBJECT WITH THE DATA

if(user){

    res.status(200).json({id:user.id,name:user.name,email:user.email,gender:user.gender,dp:user.dp,usertoken:generateToken(user.id)})

}else{

    res.status(400)
    throw new Error("Failed to create user");

}

});

//IF ITS NOT A DEFAULT EXPORT THEN WE NEEED TO PUT IT IN BRACKETS



//USER LOGGING AUTHENTICATION 

const logUser = asyncHandler(async(req,res) => {

    const {email,password} = req.body;
    
    const user = await userMod.findOne({email});

    if(user && (await user.matchPassword(password))) {

        res.status(200);
        res.json({id:user.id,name:user.name,email:user.email,gender:user.gender,dp:user.dp,usertoken:generateToken(user.id)})

    }else{

        res.status(400);
        throw new Error("Invalid email or password,Please check again"); 
    }

});


const getAllUsers = asyncHandler(async (req,res) => {
/*YOU DONT NEED TO ADD :ID OR PARAMS TO USE 
QUERY PARAMS JUST ADD ?ID ETC.. IN THE URL AND
IT WILL CATCH IT IN THE REQ.QUERY.PARAM */
 //THIS IS THE OR OPERATOR IN MONGODB EITHER ONE OF THESE OBJECTS TRUE ITS GONNA RETURN TRUE 
    const searchedUser = req.query.search? {$or:[{name:{$regex:req.query.search,$options:"i"}},{email:{$regex:req.query.search,$options:"i"}}]}: {}

    const users = await userMod.find(searchedUser).find({_id:{$ne:req.user._id}});

    res.send(users);


})
module.exports = {registerUser,logUser,getAllUsers};
