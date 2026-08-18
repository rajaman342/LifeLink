const User=require("../models/User");
const bcrypt=require("bcryptjs");

const getProfile=async(req,res)=>{
  try{
const user= await User.findById(req.user.id).select("-password");

if(!user){
  return res.status(404).json({
    success:false,
    message:"user not found"
  })
}

res.status(200).json({
  success:true,
user
})


  } catch(err){
    res.status(500).json({
      success:false,
      message:"error in get profile"
    })
  }
}


const updateProfile=async(req,res)=>{
  try{

    const user=await User.findByIdAndUpdate(req.user.id,
      {
        name,
        phone,
        location
      },{
        new:true,
        runValidators:true
      }
    ).select("-password");

     res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user
        });

  } catch(err){
     res.status(500).json({
      success:false,
      message:"error in update profile"
    })
  }
}

const changePassword=async(req,res)=>{
  try{

       const {oldPassword,newPassword}=req.body;
       if(!oldPassword||!newPassword){
        return res.status(400).json({
          success:false,
          message:"enter all the value"
        })
       }

       const user=await User.findById(req.user.id);

       const isMatch=await bcrypt.compare(oldPassword,user.password);

       if(!isMatch){
        return res.status(400).json({
          success:false,
          message:"old password do not match"
        })
       }
const hashedPassword=await bcrypt.hash(newPassword,10);

user.password=hashedPassword;


await user.save();
res.status(200).json({
  success:true,
  message:"password changed successfully"
})


  } catch(err){
     res.status(500).json({
      success:false,
      message:"error in  change password"
    })
  }
}

module.exports={
  getProfile,
  updateProfile,
  changePassword
}