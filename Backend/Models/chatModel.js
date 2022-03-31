/*THE PROPERTIES OR THINGS WE INCLUDE ARE
CHATNAME,ISGROUPCHAT,USERS,LATESTMESSAGE,GROUPADMIN*/
const mongoose = require('mongoose');

//CREATE THE CHAT MODEL WE WANT USINGMONGOOSE SCHHEMA PROPERTY
const chatModel = mongoose.Schema(

    {
        chatName:{type:String,trim:true},
        groupChat:{type:Boolean, default:false},
        /*WE USE MONGOOSE.SCHEMA.TYPE.OBJECTID TO ADD THE ID
        MONGOOSE CREATE WHEN WE CREATE A SCHEMA*/
        users:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
        lastMessage:{type:mongoose.Schema.Types.ObjectId, ref:"Message"},
        groupAdmin:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
        chatPic:{type:String}

    },
    //THIS ADDS A TIMESTAMP WHENEVER WE USE THIS MODEL
    { timestamps: true, }
    
);
//SETTING A NEW MODAL CALL "CHAT" AND INCLUDING THE ABOVE MODEL TO IT
const Chat = mongoose.model("Chat",chatModel);

//EXPORTING THE MODEL
module.exports = Chat;