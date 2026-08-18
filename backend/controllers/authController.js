  const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
  const User=require("../models/User");
const sendEmail = require("../utils/sendEmail");
  
  
  const signup= async(req,res)=>{
    try{

      const{
        name,
        email,
        password,
        phone,
        location,
        bloodGroup,
        role,

      }=req.body;

      if (
    !name ||
    !email ||
    !password ||
    !phone     
  
) {
    return res.status(400).json({
        success: false,
        message: "All fields are required"
    });
}
      
      const existingUser=await User.findOne({email});
      if(existingUser){
        return res.status(400).json({
          success:false,
          message:"User Already exist"
        })
      }

      const hashedPassword=await bcrypt.hash(password,10);
      const user=await User.create({
        name,email,
        password:hashedPassword,
        phone,
        bloodGroup,
        location,
        role
      });
      await sendEmail(
        user.email,
        "Welcome to LifeLink",
        `<h2>Welcome ${user.name}</h2>
        <p>
          Thank you for registering on LifeLink
        </p>`
        
      );

      res.status(201).json({
        success:true,
        message:"User registered successfully",
        user
      })

    } catch(err){
       res.status(500).json({
        success:false,
        message:err.message
       })
    }


}

const login=async(req,res)=>{
  try{

    const {email,password}=req.body;
    if(!email||!password){
      return res.status(400).json({
        success:false,
        message:"All fields are required"
      })
    }

    const user=await User.findOne({email});

    if(!user){
      return res.status(404).json({
        success:false,
        message:"user not exists"
      })
    }

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(401).json({
        success:false,
        message:"invalid credentials"
      })
    }

    const token =jwt.sign(
      {
        id:user._id,
        role:user.role

      },
      process.env.JWT_SECRET,
      {
        expiresIn:"7D"
      }

    );
    user.password=undefined;
    res.status(200).json({
      success:true,
      message:"user logged in successfully",
      user,
      token
    })





  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }

}

module.exports={signup
  ,login
};
