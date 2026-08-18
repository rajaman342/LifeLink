const express=require("express");
const auth=require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const { getDonationHistory, getAllDonors, getDonorById, updateAvailability } = require("../controllers/donorController");
const router=express.Router();

router.get("/all",auth,getAllDonors);


router.put("/availability",auth,authorizeRoles("donor"),updateAvailability);
router.put(
    "/availability",
    auth,
    authorizeRoles("donor"),
    updateAvailability
);

router.get("/donation-history",auth,authorizeRoles("donor"),getDonationHistory);
router.get("/:id",auth,getDonorById);


module.exports=router;