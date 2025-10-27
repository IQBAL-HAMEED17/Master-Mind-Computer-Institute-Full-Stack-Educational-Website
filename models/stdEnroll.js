const mongoose=require("mongoose");

const stdenrollinfo=new mongoose.Schema({
    name:{
type:String
    },
    fathersname:{
type:String
    },
    address:{
       type:String 
    },
    village:{
        type:String
    },
    tehsil:{
        type:String
    },
    district:{
        type:String
    },
    pincode:{
        type:Number
    },
    qualification:{
        type:String
    },
    dob:{
        type:String
    },
    phoneno:{
        type:Number
    },
    stdphoto:{
        type:String
    },
    courseapplied:{
        type:[String]
    },
    stdsign:{
        type:String
    },
    fathersign:{
        type:String
    }

});

const enrollinfo=mongoose.model("enrollinfo",stdenrollinfo);

module.exports=enrollinfo;