/*IMPORTING EXPRESS MODULE WHICH IS USED FOR 
CREATING BACKEND REQUESTS WITH THE DATABASE/SERVER(MONGO-DB)
ITS A BACKEND FRAMWORK*/
const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./Dummy Data/data");
const userRoutes = require('./Routes/userRoutes');
const {notFound,errorHandler} = require("./serverErrorHandling/error")
const cors = require("cors");
const connectDB = require("./config/db");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require('./Routes/messageRoutes');
const { application } = require("express");
const { Socket } = require("socket.io");
const { chooseUserIdInServer } = require("../clcklab/src/components/ChatComponents.js/chooseUserIdinServer");
const path = require('path');




//CREATE AN INSTANCE OF THE EXPRESS METHOD
const app = express();

//THIS TELLS THER EXPRESS SERVER TO LET PARSE JSON OBJECTS
app.use(express.json());


app.use(cors({origin:"http://localhost:3000"}));

/*ADDING THE .ENV CONFIG METHOD THIS TRIGGERS 
AND LOOKS FOT THE DEFAULT .ENV FILE IN AOUR LOCAL FILES
AND INJECT OR ACESS THE GLOBAL PROCESS OBJECT IN OUR WINDOW 
AND THE DEFAULT FILENAME WHICH IS .ENV */
dotenv.config();

//CALLING THE CONNECT FUNCTION THAT WE CREATED IN THE DB.JS IN CONFIG FOLDER
connectDB();



/*app.get('/api/chat', (req, res) => {
  res.send(chats);
});
app.get('/api/chat/:id', (req, res) => {
    /*THIS IS HOW YOU CAN ACESSS YOUR PARAMS 
    THROUGH THE REQUEST YOU SEND TO THER SERVER 
    FROM THIS PORT*/
    //(req.params.id);
    /*THIS IS HOOW YOU CAN GET THE DATA 
    FROM THE CHATS ARRAY ACCORDING TO YOUR 
    PARAM.ID AND SEND IT TO THE CLIENT 
  const singleChatUser = chats.find(chat => chat._id == req.params.id)
    res.send(singleChatUser);
});*/

//USING THE USERROUTES FUNCTION IN THE USE MIDDLEWARE
app.use('/api/user/',userRoutes);
app.use('/api/chats/',chatRoutes);
app.use('/api/messages/',messageRoutes);


//---------------------Deployment-------------------------

const __dirname1 = path.resolve();

const Mode = "production"

if(Mode === "production"){

app.use(express.static(path.join(__dirname1,"/clcklab/build")));

app.get('*',(req,res) => {
  res.sendFile(path.resolve(__dirname1,"clcklab","build","index.html"));
});

}else{

app.get('/', (req, res) => {
    res.send('APi is running');
});

}


//---------------------Deployment-------------------------


//HANDLING SERVER SIDE ERRORS USING THE USE MIDDLEWARE

app.use(notFound);
app.use(errorHandler);


//APPLYING THE .ENV VARIABLE OR THE HARDCODED PORT TO LISTEN 

const PORT = process.env.PORT || 5000
//APPLY A WEB PORT TO LISTEN WHEN SENDING REQUESTS
const server =  app.listen(PORT, console.log('listening'))




 //REQURING SOCKET.IO THIS IS A FUNCTION

 const io = require('socket.io')(server,{

  cors:{

    origin:["http://localhost:3000",],

  }

 });

 //THE CONNECTION KEYTWORD IS A REQUIRED KEYWORD IN SOCKET IO FOR CONNECTION

 io.on('connection',(socket) => {

  console.log(`Connected with ${socket.id}`)

       socket.on("setup",(userData) => {

        console.log(userData.id);

        socket.join(userData.id);

        socket.emit("connected");

       });

         socket.on("join room", (room) => {

          socket.join(room);

          console.log(`Joined ${room}`);

        });

        socket.on("typing",(room,chat,sender) => {

          if(chat.groupChat === false){

            socket.in(room).emit("typed",chat);

          }else{

            chat.users.forEach(user => {

              if(user._id === sender) return;

              socket.in(user._id).emit("typed-group",sender,chat);
             
            });

          }

        })
        
        socket.on("stop typing",(room) => socket.in(room).emit("stop typing"))

        socket.on("new message", (message) => {

        var users = message.chat.users

        var sendingUser = message.sender 

        console.log(message._id);

        users.forEach((user) => {

         if(user._id === sendingUser._id ) return;

          socket.to(user._id).emit("send message",message);

        });

    });

    socket.on("new-chat",(data,roomId) => {

      socket.in(roomId).emit("created-new-chat",data);

    });

    socket.on("user-added",(chatId,userId,newChat) => {

    if(newChat.groupChat === true){

          newChat.users.forEach((user) => {

          socket.to(user._id).emit("new-user-added",newChat,userId,chatId);

        });
      }
    });

    socket.on("user-removed",(chatId,userId,newChat) => {


        newChat.users.forEach((user) => {
          
          socket.in(user._id).emit("user-remove",newChat,userId,chatId);

        });

       socket.in(userId).emit("removedUser",newChat,userId)
    });



    socket.on("new group",(newChat,Chatname,users) =>{

      users.forEach(user => {

        socket.in(user).emit("new group chat",newChat)

      });

    });

    socket.on("mystatus",(userchats,userstatus,userId) => {

      //console.log(userstatus,userId,userchats)

      userchats.forEach(chat => {

        if(chat.groupChat === false){

         socket.in(chooseUserIdInServer(chat.users,userId)).emit("guest-status",userstatus,userId)

        }

      });

    });

    socket.on("loggedOut",(userid,userchats) => {

      userchats.forEach( chat => {

        socket.in(chooseUserIdInServer(chat.users,userid)).emit("user-loggout",userid)

      });

    });

   socket.off("setup",() => {

      console.log("Disconnected");
      //DISCONNECTING THE SOCKET
      socket.leave(userData._id);

    });
});
