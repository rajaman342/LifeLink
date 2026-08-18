const mongoose =require("mongoose");
const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },
  password:{
    type:String,
    required:true
  },
  phone:{
    type:String,
    required:true
  },
  bloodGroup:{
   type:String,
    enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
    ],
    required: true
}
,
  location:{
   city:{
    type:String,
   
   },
   state:{
     type:String,
   
   },
   pin:{
     type:String,
  
   }
  },

role:{
  type:String,
  enum:["donor","patient","hospital","admin"],
  default:"donor"
},
availability:{
  type:Boolean,
  default:true

}
,
lastDonation:{
  type:Date,
  default:null
}


},{
  timestamps:true
});

module.exports=mongoose.model("User",userSchema);