// getAllUsers()
// deleteUser()
// verifyHospital()
// getDashboardStats()
const User=require("../models/User");
const Hospital=require("../models/Hospital");
const EmergencyRequest=require("../models/EmergencyRequest");
const Donation = require("../models/Donation");

const getDashboardStats=async(req,res)=>{
  try{
    const totalUsers=await User.countDocuments();
    const totalDonors=await User.countDocuments({
      role:"donor"
    })

    const totalPatients=await User.countDocuments({
      role:"patient"
    })

const totalHospitals=await Hospital.countDocuments();

const verifiedHospitals=await Hospital.countDocuments({
  isVerified:true
});

const totalRequests=await EmergencyRequest.countDocuments();

const completedDonations=await Donation.countDocuments();

res.status(200).json({
  success:true,
  totalDonors,
  totalUsers,
  totalPatients,
  totalHospitals,
  totalRequests,
  verifiedHospitals,
   completedDonations
})



  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
};

const getAllUsers=async(req,res)=>{
  try{

    const users=await User.find().select("-password");

    res.status(200).json({
      success:true,
      total:users.length,
      users
    })

  }catch(err){
     res.status(500).json({
      success:false,
      message:err.message
    })
  }
};

const getUserById=async(req,res)=>{
  try{

    const user=await User.findById(req.params.id).select("-password");

    if(!user){
      return res.status(404).json({
        success:false,
        message:"user not found with this  id"
      })
    }

    res.status(200).json({
      success:true,
      user
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
};

const deleteUser=async(req,res)=>{
  try{
    const user=await User.findById(req.params.id).select("-password");

    if(!user){
      return res.status(404).json({
        success:false,
        message:"user not found"
      })
    }
    await user.deleteOne();
    res.status(200).json({
      success:true,
      message:"user deleted successfully"
    })

  }catch(err){
     res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

module.exports={deleteUser,getDashboardStats,getAllUsers,getUserById};