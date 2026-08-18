// registerAsDonor()
// getAllDonors()
// getDonorById()
// updateAvailability()
// updateLastDonation()

const User=require("../models/User");

const Donation=require("../models/Donation");


const getAllDonors = async (req, res) => {
    try {

       

        const filter = {
            role: "donor"
        };

        // Blood group filter
        if (req.query.bloodGroup) {
            filter.bloodGroup = req.query.bloodGroup;
        }

        // City filter
        if (req.query.city) {
            filter["location.city"] = req.query.city;
        }

        // Availability filter
        if (req.query.availability !== undefined) {
            filter.availability =
                req.query.availability === "true";
        }

        // Name search
        if (req.query.search) {
            filter.name = {
                $regex: req.query.search,
                $options: "i"
            };
        }

        console.log("Filter:", filter);


      
        const page = Math.max(
            Number(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );

        const skip = (page - 1) * limit;


  

        const sort = req.query.sort || "-createdAt";


        const totalDonors =
            await User.countDocuments(filter);

        const donors = await User.find(filter)
            .select("-password")
            .sort(sort)
            .skip(skip)
            .limit(limit);


    

        const totalPages =
            Math.ceil(totalDonors / limit);


        res.status(200).json({

            success: true,

            currentPage: page,

            totalPages,

            totalDonors,

            limit,

            donors

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }
};

const getDonorById=async(req,res)=>{
  try{
    const donor=await User.findOne({
      _id:req.params.id,
      role:"donor"
    });
    if(!donor){
      return res.status(404).json({
        success:false,
        message:"donor not found with this id"
      })
    }

    res.status(200).json({
      success:true,
      message:"user with id fetched successfully",
      donor
    })

  } catch(err){
    res.status(500).json({
      success:false,
      message:"something went wrong while fetching  donor by id"
    })
  }
}

const updateAvailability=async(req,res)=>{
  try{

    const {availability}=req.body;

    const donor=await User.findByIdAndUpdate(
      req.user.id,
      {
        availability
      },
      {
        new:true,
        runValidators: true
      }
    ).select("-password");

    res.status(200).json({
      success:true,
      message:"availability updated",
      donor
    })

  } catch(err){
     res.status(500).json({
      success:false,
      message:"something went wrong while updating availability"
    })
  }
}

const getDonationHistory=async(req,res)=>{
  try{

    const donations=await Donation.find({
      donor:req.user.id
    })
    .populate("patient","name email bloodGroup")
    .populate("emergencyRequest","bloodGroup hospitalName");
    

    res.status(200).json({
      success:true,
      total:donations.length,
      donations
    })

  }catch(err){
     res.status(500).json({
      success:false,
      message:"something went wrong while getting donation history"
    })
  }
}
module.exports={
  getAllDonors,getDonorById,updateAvailability,getDonationHistory
}