const mongoose=require("mongoose");
const emergencyRequestSchema=new mongoose.Schema({
  patient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
    bloodGroup:{
        type:String,
        required:true,
        enum:["A+","A-","B+","B-","AB+","AB-","O+","O-"]
    },

    unitsRequired:{
        type:Number,
        required:true
    },

    hospitalName:{
        type:String,
        required:true
    },

    hospitalAddress:{
        type:String,
        required:true
    },

    contactNumber:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:["Pending","Accepted","Completed","Cancelled"],
        default:"Pending"
    },
    donor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:null
},

acceptedAt:{
    type:Date,
    default:null
},

completedAt:{
    type:Date,
    default:null
}

},{
  timestamps:true
});

module.exports=mongoose.model("EmergencyRequest",emergencyRequestSchema);