const express=require("express");

const auth=require("../middleware/authMiddleware");
const { createEmergencyRequest, getAllEmergencyRequests, getEmergencyRequestById, updateRequestStatus, acceptEmergencyRequest, rejectEmergencyRequest, completeDonation, getMyEmergencyRequests } = require("../controllers/emergencyController");
const authorizeRoles = require("../middleware/authorizeRoles");

const router=express.Router();

router.post("/create",auth,createEmergencyRequest);

router.get("/all",auth,getAllEmergencyRequests);


router.get(
    "/my-requests",
    auth,
    authorizeRoles("patient"),
    getMyEmergencyRequests
);

router.put("/status/:id",auth,authorizeRoles("hospital","admin"),updateRequestStatus);

router.put("/accept/:id",auth,authorizeRoles("donor"),acceptEmergencyRequest);
router.put("/reject/:id",auth,authorizeRoles("donor","hospital"),rejectEmergencyRequest);

router.put("/complete/:id",auth,authorizeRoles("hospital"),completeDonation);
router.get("/:id",auth,getEmergencyRequestById);

module.exports=router;
