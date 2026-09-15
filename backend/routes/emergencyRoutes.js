const express = require("express");

const auth = require("../middleware/authMiddleware");

const {
  createEmergencyRequest,
  getAllEmergencyRequests,
  getEmergencyRequestById,
  updateRequestStatus,
  acceptEmergencyRequest,
  rejectEmergencyRequest,
  completeDonation,
  getMyEmergencyRequests,
  recommendDonors,
} = require("../controllers/emergencyController");

const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

// ===============================
// CREATE EMERGENCY REQUEST
// ===============================

router.post("/create", auth, createEmergencyRequest);

// ===============================
// GET ALL EMERGENCY REQUESTS
// ===============================

router.get("/all", auth, getAllEmergencyRequests);

// ===============================
// GET MY REQUESTS
// ===============================

router.get(
  "/my-requests",
  auth,
  authorizeRoles("patient"),
  getMyEmergencyRequests,
);

// ===============================
// AI DONOR RECOMMENDATION
// ===============================

router.post(
  "/recommend",
  auth,
  authorizeRoles("patient", "hospital", "admin"),
  recommendDonors,
);

// ===============================
// UPDATE REQUEST STATUS
// ===============================

router.put(
  "/status/:id",
  auth,
  authorizeRoles("hospital", "admin"),
  updateRequestStatus,
);

// ===============================
// ACCEPT REQUEST
// ===============================

router.put(
  "/accept/:id",
  auth,
  authorizeRoles("donor"),
  acceptEmergencyRequest,
);

// ===============================
// REJECT REQUEST
// ===============================

router.put(
  "/reject/:id",
  auth,
  authorizeRoles("donor", "hospital"),
  rejectEmergencyRequest,
);

// ===============================
// COMPLETE DONATION
// ===============================

router.put("/complete/:id", auth, authorizeRoles("hospital"), completeDonation);

// ===============================
// GET REQUEST BY ID
// ===============================

router.get("/:id", auth, getEmergencyRequestById);

module.exports = router;
