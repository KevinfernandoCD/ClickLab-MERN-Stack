const mongoose = require("mongoose");
//BCRYPT IS LIBRARY TO HASH OUR PASSWORSDS 
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema(

    {

        name:{type:String, required:true},
        email:{type:String, required:true,unique:true},
        password:{type:String, required:true},
        dp:{type:String,default:"https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"},
        gender:{type:String,required:true}


    },

   { timestamps:true}

);

userModel.methods.matchPassword = async function(enteredPassword){
    
    return await bcrypt.compare(enteredPassword,this.password)
     
}

//MONGOOSE MIDDLEWARE PRE OR POST AND USE THE METHOD AS THE FIRST PARAM
userModel.pre("save",async function (next) {

/*isModifies is a mongoose scema build in property that
gives a tru or alse value if a schema property is changed*/ 

if(!this.isModified){
    next();
}
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password,salt)

});

const userMod = mongoose.model("User",userModel);

module.exports = userMod;