// registerHospital()
// getHospitalProfile()
// updateHospital()
// verifyEmergencyRequest()
const Hospital=require("../models/Hospital");


const EmergencyRequest=require("../models/EmergencyRequest");

const registerHospital=async(req,res)=>{
  try{

const hospital=await Hospital.create({
  user:req.user.id,
  ...req.body
});

res.status(201).json({
  success:true,
  message:"hospital created successfully",
  hospital
})

  }catch(err){
    res.status(500).json({
      success:false,
      message:"error  while registering hospital"
    })
  }

}

const getHospitalProfile=async(req,res)=>{
  try{
 const hospital=await Hospital.findOne({
  user:req.user.id
 }).populate("user","name email phone");

 if(!hospital){
  return res.status(404).json({
    success:false,
    message:"hospital not found"
  })
 }


 res.status(200).json({
  success:true,
  hospital
 })


  }catch(err){
     res.status(500).json({
      success:false,
      message:"error while getting hospital"
    })
  }
}


const updateHospitalProfile=async(req,res)=>{
  try{

    const hospital=await Hospital.findOneAndUpdate({
       user:req.user.id
    },
  req.body,{
    new:true,
    runValidators:true

  });

  res.status(200).json({
    success:true,
    hospital
  })

  }catch(err){

     res.status(500).json({
      success:false,
      message:"error while updating hospital profile"
    })

  }
}


const getAllHospitals= async(req,res)=>{
  try{
       const hospitals=await Hospital.find()
       .populate("user","name email");

       res.status(200).json({
        success:true,
        total:hospitals.length,
        hospitals
       })


  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

const getHospitalById=async(req,res)=>{
  try{
    const hospital=await Hospital.findById(req.params.id)
    .populate("user","name email phone");
    if(!hospital){
      return res.status(404).json({
        success:false,
        message:"hospital not found with this id"
      })
    }

   return  res.status(200).json({
      success:true,
      hospital
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })

  }
}

const verifyHospital=async(req,res)=>{
  try{

    const hospital=await Hospital.findById(req.params.id);
    if(!hospital){
      return res.status(404).json({
        success:false,
        message:"hospital not found for verification"
      })
    }

    hospital.isVerified=true;
    await Hospital.save();


      res.status(200).json({
        success:true,
        message:"hospital verified"
      })

  } catch(err){
      res.status(500).json({
      success:false,
      message:err.message
    })

  }
}


const hospitalDashboard=async(req,res)=>{
  try{
const pending=await EmergencyRequest.countDocuments({
  status:"Pending"
});

const accepted=await EmergencyRequest.countDocuments({
  status:"Accepted"
});

const completed=await EmergencyRequest.countDocuments({
  status:"Completed"
});

res.status(200).json({

  success:true,
  dashboard:{
    pending,
    accepted,
    completed
  }
  
})


  }catch(err){
     res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

module.exports={
  registerHospital,
  getHospitalProfile,
  updateHospitalProfile,
  hospitalDashboard,
  verifyHospital,
  getAllHospitals,
  getHospitalById
}