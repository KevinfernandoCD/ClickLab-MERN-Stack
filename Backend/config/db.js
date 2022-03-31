const mongoose = require("mongoose");

//CONNECTING TO THE MONGODB DATABSE USING THE URI PARSER

const connectDB = async () => {

    try {

        const conn = await mongoose.connect('mongodb+srv://kevinfernando123:PiXGdHUFr8foVmCx@cluster0.0ajda.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true});

        console.log(`Connected to the database`)
        
    } catch (error) {

        console.log(`error:${error}`);
        process.exit();
        
    }

};

module.exports = connectDB;