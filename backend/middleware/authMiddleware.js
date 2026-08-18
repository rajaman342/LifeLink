const jwt=require("jsonwebtoken");

const auth=async(req,res,next)=>{
  try{

   const authHeader = req.header("Authorization");


    if(!authHeader){
      return res.status(401).json({
        success:false,
        message:"token missing"
      })
    }
    const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

   
    const decoded =jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded;
    next();


  }catch(err){
    res.status(401).json({
      success:false,
      message:"invalid token"
    })
  }
}

module.exports=auth;