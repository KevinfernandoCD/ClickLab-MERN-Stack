const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
//IMPORTING THE CHAT MODEL
const chatMod = require("../Models/chatModel");
const userMod = require("../Models/userModel");

//CREATE A SINGLE CHAT

const createChat = asyncHandler(async (req,res,next) => {

    /*GET THE USER ID OF THE OTHER
    USER WE ARE SENDING THROUGH THE REQUEST 
    OBJECT*/

    const {userId} = req.body;
    
    /*CHECK WHEATHER THE USERID 
    IS EXIST IN THE REQ*/

    if(!userId){
    
        res.status(400);
        throw new Error("Failed to find the Contact-Id");

    }

    /*CHECKING IF THERES AN CHAT EWXIST
    WITH THE ID IF IT DOES DO THE FOLLOWING BELOW
    USING AND OPERATOR IN MONGODB*/

    let Chat = await chatMod.find({groupChat:false,$and:[{users:{$elemMatch:{$eq:req.user._id}}},{users:{$elemMatch:{$eq:userId}}}]}).populate("users","-password").populate("lastMessage"); 

    /*THIS IS A METHOD MODEL.POPULATE INTRODUCED BY MONGFOOSE
    TO ACCESS AND POPULATE A NESTED MODEL IT TAKES THE OBJECT WE CREATED AND THEN THE PATH AND SELECTED FEILDS USE THE MODEL 
    THAT WE WANT TO POPULATE DIRECTLY BY ADDING POPULATE METHOD*/
    Chat = await userMod.populate(Chat,{path:"lastMessage.sender",select:"name dp email",});


   if(Chat.length > 0 ){

    res.send(Chat[0])


   }else{

    const user = await userMod.findOne({_id:userId});

    var chatData = {
        chatName :"New-Chat",
        groupChat:false,
        users:[req.user._id,userId],
    }

    try {

        const createChat = chatMod.create(chatData);

        /*EVERY CREATED MODEL GETS AND  ID 
        BY MONGO DB WE USE THAT ID PROPERTY HERE 
        TO GET THE CREATED CHAT MODEL*/

        const getChat = chatMod.findOne({_id:createChat._id}).populate("users","-password");

        res.status(200);
        res.send(getChat);
        
    } catch (error) {

        res.status(401);
        throw new Error("Failed to create chat,Try again");
        
    }


   }


});


//FETCHING ALL CHATS SINGLE/GROUP

const fetchChat = asyncHandler(async (req,res,next) => {

    try {

    const chats =  await Chat.find({users:{$elemMatch:{$eq:req.user._id}}}).populate("users","-password").populate("lastMessage").populate("groupAdmin","-password").sort({updatedAt:-1});

    const finalChats = await  userMod.populate(chats,{path:"lastMessage.sender",select:"email dp name"});

    res.status(200);

    if(finalChats.length > 0 ){

        res.send(finalChats);
    
    }else{

        res.send("No chats available");
    }

    
    } catch (error) {

        res.status(400)
        throw new Error("Failed to retrieve data");
   
}


});



//CREATING A GROUP CHAT

const createGroup = asyncHandler(async(req,res)=>{


    if(!req.body.users || !req.body.chatName || !req.body.chatPic){

        return res.status(400).send({message:"Please fill the requirements to create the group"})
    }

    let users = JSON.parse(req.body.users);

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName:req.body.chatName,
            groupChat:true,
            users:users,
            groupAdmin:req.user._id,
            chatPic:req.body.chatPic
        });

        const finalGroupChat = await Chat.findOne({_id:groupChat._id}).populate("users","-password").populate("groupAdmin","-password");

        res.status(200);
        res.send(finalGroupChat);

        
    } catch (error) {

        res.status(400);
        throw new Error(error.message);
        
    }

  
});


//UPDATING THE CHATS SINGLE/GROUP

const updateGroup = asyncHandler(async(req,res)=>{


    try {

        const {chatId,chatName,chatPic} = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(chatId,{chatName:chatName,chatPic:chatPic},{new:true}).populate("users","-password").populate("groupAdmin","-password");

        res.status(200);

        res.json(updatedChat);


    } catch (error) {

        res.status(400);
        throw new Error(error.message);
        
    }
    
});


//ADD USERS TO A CHAT

const addToGroup = asyncHandler(async(req,res) => {

    const  {userId,chatId} = req.body;

    //AUTHENTICATING IF THE CHAT IS NOT A SINGLE CHAT

    const isGroupChat = await Chat.findOne({_id:chatId})


    if(isGroupChat.groupChat == true){

     try {

          const added = await Chat.findByIdAndUpdate(chatId,
        {
           $push:{users:userId}
           
        },{new:true}).populate("users","-password").populate("groupAdmin","-password");

        res.json(added);

        
    } catch (error) {

        res.status(400);
        throw new Error(error.message);
        
    }


    }else{


        res.status(404);
        throw new Error("Invalid Chat Type");


    }

});

//REMOVE A USER FROM THE CHAT

const removeFromGroup = asyncHandler(async (req,res) => {

     const  {userId,chatId} = req.body;

      const isGroupChat = await Chat.findOne({_id:chatId})


    if(isGroupChat.groupChat == true){

        
    try {

          const removed = await Chat.findByIdAndUpdate(chatId,
        {
           $pull:{users:userId}
           
        },{new:true}).populate("users","-password").populate("groupAdmin","-password");

        res.json(removed);

        
    } catch (error) {

        res.status(400);
        throw new Error(error.message);
        
    }

    }else{

         res.status(404);
        throw new Error("Invalid Chat Type");
    }


});

//GET ALL CHAT GROUPS FOR THE USER

const getGroups = asyncHandler(async (req,res) => {


    try {

    const {userId} = req.body;

    const groups = await chatMod.find({groupChat:true,$and:[{users:{$elemMatch:{$eq:req.user._id}}},{users:{$elemMatch:{$eq:userId}}}]});

    if(groups.length !== 0){

        res.status(200)
        res.json(groups)

    }else{

        res.status(200)
        res.send("No Mutual Groups")
    }
        
    } catch (error) {

        res.status(400)

        throw new Error("Failed to get chats");

        
    }



})



const UpdateGroupImage = asyncHandler(async(req,res) => {

     const  {newChatPic,chatId} = req.body;

    const isGroupChat = await Chat.findOne({_id:chatId})
    
    if(isGroupChat.groupChat == true){


        try {

              const newImageGroup = await Chat.findByIdAndUpdate(chatId,{chatPic:newChatPic},{new:true}).populate("users","-password").populate("groupAdmin","-password");

              res.json(newImageGroup);
            
        } catch (error) {


               res.status(400);
               throw new Error(error.message);


        }
    }else{

         res.status(404);
        throw new Error("Invalid Chat Type");

    }

})

//DELETE A CHAT

const deleteChat = asyncHandler(async (req,res) => {

    const {chatId} = req.body;

    if(!chatId){

        res.status(400)
        throw new Error("No Id found!");
    }

    try {

        const deleted =  await Chat.findByIdAndDelete(chatId);

        res.status(200)

        res.send(deleted);
        
    } catch (error) {

        res.status(404);
        throw new Error("Invalid Chat ID")
        
    }

})

module.exports = {createChat,fetchChat,createGroup,updateGroup,addToGroup,removeFromGroup,getGroups,UpdateGroupImage,deleteChat};