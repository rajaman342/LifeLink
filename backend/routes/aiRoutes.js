const express = require("express");

const auth = require("../middleware/authMiddleware");

const {
    recommendDonors
} = require("../controllers/aiController");


const router = express.Router();


router.post(
    "/recommend-donors",
    auth,
    recommendDonors
);


module.exports = router;