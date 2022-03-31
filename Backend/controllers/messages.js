
const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const Message = require('../Models/messageModel');
const User = require("../Models/userModel");

/*SEND MESSAGES */

const sendMessage = asyncHandler( async (req,res) => {


    const {message,chatId} = req.body;


    if(!message || !chatId){

        return res.sendStatus(400);
    }

    var newMessage = {

       sender:req.user._id,
       content:message,
       chat:chatId
    };

    try {

        let content = await Message.create(newMessage);

       /*THEN WE UPDATE THE CHAT MODEL OF THE GIVEN CHAT ID
       AND PUT IN THE MESSAGE MODEL INSIDE*/

        await Chat.findByIdAndUpdate(req.body.chatId,{lastMessage:content._id});

        let UpdatedChat = await Chat.find({_id:chatId}).populate("lastMessage");

        UpdatedChat = await User.populate(UpdatedChat,{path:"lastMessage.sender",select:"name dp"})

        UpdatedChat =  await Chat.populate(UpdatedChat,{path:"lastMessage.chat"});

        UpdatedChat  = await User.populate(UpdatedChat,{path:"lastMessage.chat.users"});

        res.status(200)
     
        res.json(UpdatedChat);


    } catch (error) {

        res.status(400);
        throw new Error(error.message)
        
    }

});

//GET ALL MESSAGE OBJECTS FOR A SPECIFIC CHAT

const getMessages = asyncHandler( async (req,res) => {

try {

    const allmessages = await Message.find({chat:req.params.chatId}).populate("sender","name dp email").populate("chat");

    res.status(200)
    res.json(allmessages)
    
} catch (error) {

    res.status(400)
    throw new Error(error.message);
    
}

});


module.exports = {sendMessage,getMessages};