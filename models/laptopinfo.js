

// let avaiLaptops=[{
//     image:"https://th.bing.com/th/id/OIP.ZtURYhIvDTliib-BAf5xUAHaE3?w=293&h=192&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
//     details:"Asus vivobook 15 go 4gb ram 512ssd",
//     features:"Ram 8gb SSD 512gb Graphics 2gb Nvidia ",
//     price:"25000",
//     discount:"1000"
// },
// {
//     image:"https://th.bing.com/th/id/OIP.Ir29KH8ifMH_oEOBLg6uYwHaHa?w=192&h=192&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
//     details:"Hp brand 15 go 4gb ram 512ssd",
//       features:"Ram 8gb SSD 512gb Graphics 2gb Nvidia ",
//     price:"24000",
//     discount:"1000"
// },
// ]

const mongoose=require("mongoose");

const laptopSchema=new mongoose.Schema(
    {
    image:{
        type:String,
    },
    details:{
        type:String
    },
    features:{
        type:String
    },
    price:{
        type:Number
    },
    discount:{
     type:Number
    }
});


const laptopinfo=mongoose.model("laptopinfo",laptopSchema);

module.exports=laptopinfo;