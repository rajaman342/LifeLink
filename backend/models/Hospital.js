const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },

    hospitalName:{
        type:String,
        required:true
    },

    registrationNumber:{
        type:String,
        required:true,
        unique:true
    },

    address:{
        type:String,
        required:true
    },

    city:{
        type:String,
        required:true
    },

    state:{
        type:String,
        required:true
    },

    contactNumber:{
        type:String,
        required:true
    },

    isVerified:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Hospital", hospitalSchema);