// createEmergencyRequest()
// getAllEmergencyRequests()
// getEmergencyRequestById()
// acceptEmergencyRequest()
// rejectEmergencyRequest()
// completeEmergencyRequest()

const EmergencyRequest=require("../models/EmergencyRequest");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const Donation=require("../models/Donation");


const createEmergencyRequest=async(req,res)=>{
  try{

 const {
            bloodGroup,
            unitsRequired,
            hospitalName,
            hospitalAddress,
            contactNumber
        } = req.body;

        if (
    !bloodGroup ||
    !unitsRequired ||
    !hospitalName ||
    !hospitalAddress ||
    !contactNumber
) {
    return res.status(400).json({
        success: false,
        message: "All fields are required"
    });
}

          const request = await EmergencyRequest.create({

            patient:req.user.id,

            bloodGroup,

            unitsRequired,

            hospitalName,

            hospitalAddress,

            contactNumber

        });

        const donors=await User.find({
          role:"donor",
          bloodGroup:bloodGroup,
          availability:true
        })

        for(const donor of donors){
          await sendEmail(
            donor.email,
            "Emergency Blood Request",
            `
            <h2>Emergency</h2>
            <p>
            BloodGroup ${bloodGroup}
            Hospital ${hospitalName}
            Address ${hospitalAddress}
            </p>
            `
          )
        }
        res.status(201).json({

            success:true,

            message:"Emergency Request Created",

            request

        });


  } catch(err){
    res.status(500).json({
      success:false,
      message:"error in create emergency request"
    })
  }
}


const getAllEmergencyRequests=async(req,res)=>{
  try{
    const filter={};
    if(req.query.bloodGroup){
      filter.bloodGroup=req.query.bloodGroup;

    }

    if(req.query.status){
      filter.status=req.query.status;
    }
   const requests=await EmergencyRequest.find(filter).
   populate("patient", "name email phone bloodGroup location") .populate(
        "donor",
        "name email phone bloodGroup"
    );

    res.status(200).json({
            success: true,
            total: requests.length,
            requests
        });


  }catch(err){

     res.status(500).json({
      success:false,
      message:"error in get All emergency request"
    })
  }

  }


  const getEmergencyRequestById=async(req,res)=>{
    try{

      const request=await EmergencyRequest.findById(req.params.id).populate("patient","name email phone bloodGroup location");

      if(!request){
        return res.status(404).json({
          success:false,
          message:"emergency request not found "
        })
      }

      res.status(200).json({
        success:true,
        request
      })

    } catch(err){
       res.status(500).json({
      success:false,
      message:"error in get emergency request"
    })
    }
  }
  const getMyEmergencyRequests = async (req, res) => {

    try {

        const requests = await EmergencyRequest
            .find({
                patient: req.user.id
            })
            .populate(
                "donor",
                "name email phone bloodGroup"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({

            success: true,

            requests

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};

  const updateRequestStatus=async(req,res)=>{
    try{

      const {status}=req.body;
     
      const request=await EmergencyRequest.findById(req.params.id);

      if(!request){
        return res.status(404).json({
          success:false,
          message:"request not found"
        })
      }

      request.status=status;

      await request.save();
      res.status(200).json({
        success:true,
        message:"status updated successfully"
      })

    } catch(err){
               res.status(500).json({
      success:false,
      message:"error in  update emergency request"
    })
    }
  }


  const acceptEmergencyRequest=async(req,res)=>{
    try{
      const request=await EmergencyRequest.findById(req.params.id);
      if(!request){
        return res.status(404).json({
          success:false,
          message:"request not found"

        })
      }

      if(request.status!="Pending"){
        return res.status(400).json({
          success:false,
          message:"request already processed"
        })
      }

      request.status="Accepted";
      request.donor=req.user.id;
      request.acceptedAt=new Date();
      await request.save();

      res.status(200).json({
        success:true,
        message:"request accepted",
        request
      })

    }catch(err){
      res.status(500).json({
        success:false,
        message:err.message
      })
    }
  }

  const rejectEmergencyRequest=async(req,res)=>{
    try{
      const request=await EmergencyRequest.findById(req.params.id);
       if(!request){
        return res.status(404).json({
          success:false,
          message:"request not found"

        })
      }

      request.status="Cancelled";
      await request.save();
      res.status(200).json({
        success:true,
        message:"request rejected successfully"
      })

    }catch(err){
      res.status(500).json({
        success:false,
        message:err.message
      })
    }
  }

  const completeDonation=async(req,res)=>{
    try{
      const request=await EmergencyRequest.findById(req.params.id);
       if(!request){
        return res.status(404).json({
          success:false,
          message:"request not found"

        })
      }

      if(request.status!="Accepted"){
        return res.status(400).json({
          success:false,
          message:"request must be accepted  first"
        })
      }
      if (!request.donor) {
    return res.status(400).json({
        success: false,
        message: "No donor has accepted this request"
    });
}

      request.status="Completed";
      request.completedAt=new Date();

      await request.save();

      await Donation.create({
        donor:request.donor,
        patient:request.patient,
        emergencyRequest:request._id,
      })

      res.status(200).json({
        success:true,
        message:"Donation completed"
      })

    }catch(err){
        res.status(500).json({
        success:false,
        message:err.message
      })
    }
  }

module.exports={createEmergencyRequest ,getAllEmergencyRequests,getEmergencyRequestById,updateRequestStatus
  ,rejectEmergencyRequest,
  acceptEmergencyRequest,
  completeDonation,
  getMyEmergencyRequests
};

