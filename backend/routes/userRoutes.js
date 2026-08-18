const express=require("express");
const { getProfile, updateProfile, changePassword } = require("../controllers/userController");

const auth=require("../middleware/authMiddleware");
const router=express.Router();

router.get("/profile", auth,getProfile);

router.put("/update-profile",auth,updateProfile);

router.put("/change-password",auth,changePassword);
module.exports=router;