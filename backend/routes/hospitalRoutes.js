const express=require("express");
const { registerHospital, getHospitalProfile, updateHospitalProfile, getAllHospitals, verifyHospital, hospitalDashboard, getHospitalById } = require("../controllers/hospitalController");

const router=express.Router();

const auth=require("../middleware/authMiddleware");

const authorizeRoles=require("../middleware/authorizeRoles");


router.post("/register",auth,authorizeRoles("hospital"),registerHospital);
router.get("/profile",auth,authorizeRoles("hospital"),getHospitalProfile);
router.put("/profile",auth,authorizeRoles("hospital"),updateHospitalProfile);

router.get("/all",auth,getAllHospitals);
router.get("/:id",auth,getHospitalById);


router.put("/verify/:id",auth,authorizeRoles("admin"),verifyHospital);

router.get("/dashboard",auth,authorizeRoles("hospital"),hospitalDashboard);
module.exports=router;
