const express=require("express");
const { signup,login } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");


const validate = require("../middleware/validate");
const { signupValidation } = require("../validators/authValidators");

const router=express.Router();



router.post(

    "/signup",

    signupValidation,

    validate,

    signup

);
router.post("/login",login);

router.get("/profile",auth,(req,res)=>{
   res.json({
        success: true,
        message: "Protected Route",
        user: req.user
    });
})

router.get("/admin-dashboard",auth,authorizeRoles("admin"),
    (req,res)=>{
        res.json({
            success:true,
            message:"Welcome Admin"
        })
    }
)


router.get("/reports",auth,authorizeRoles("admin","hospital"),
(req,res)=>{
    res.json({
        success:true,
        message:"Reports fetched successfully"
    })
})

module.exports=router;
