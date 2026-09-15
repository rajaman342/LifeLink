const EmergencyRequest = require("../models/EmergencyRequest");
const User = require("../models/User");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");
const Donation = require("../models/Donation");
const getDonorPrediction = require("../utils/aiPrediction");


// ======================================================
// CREATE EMERGENCY REQUEST
// ======================================================

const createEmergencyRequest = async (req, res) => {
    try {

        const {
            bloodGroup,
            unitsRequired,
            hospitalName,
            hospitalAddress,
            contactNumber
        } = req.body;


        // ==========================================
        // Validate fields
        // ==========================================

        if (
            !bloodGroup ||
            !unitsRequired ||
            !hospitalName ||
            !hospitalAddress ||
            !contactNumber
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }


        // ==========================================
        // Request expires after 6 hours
        // ==========================================

        const expiresAt = new Date(
            Date.now() + 6 * 60 * 60 * 1000
        );


        // ==========================================
        // Create emergency request
        // ==========================================

        const request = await EmergencyRequest.create({
            patient: req.user.id,
            bloodGroup,
            unitsRequired,
            hospitalName,
            hospitalAddress,
            contactNumber,
            expiresAt
        });


        // ==========================================
        // Find available matching donors
        // ==========================================

        const donors = await User.find({
            role: "donor",
            bloodGroup: bloodGroup,
            availability: true
        });


        // ==========================================
        // Notify matching donors
        // ==========================================

        for (const donor of donors) {

            // ==========================================
            // EMAIL NOTIFICATION
            // ==========================================

            try {

                await sendEmail(
                    donor.email,

                    "🚨 Emergency Blood Request",

                    `
                    <h2>Emergency Blood Request</h2>

                    <p>
                        <strong>Blood Group:</strong>
                        ${bloodGroup}
                    </p>

                    <p>
                        <strong>Units Required:</strong>
                        ${unitsRequired}
                    </p>

                    <p>
                        <strong>Hospital:</strong>
                        ${hospitalName}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${hospitalAddress}
                    </p>

                    <p>
                        <strong>Contact:</strong>
                        ${contactNumber}
                    </p>

                    <p>
                        This request will expire in
                        <strong>6 hours</strong>.
                    </p>

                    <p>
                        Please login to LifeLink to respond.
                    </p>
                    `
                );

            } catch (emailError) {

                console.log(
                    `Email failed for donor ${donor.email}:`,
                    emailError.message
                );

                // Continue notification process
            }


            // ==========================================
            // IN-APP NOTIFICATION
            // ==========================================

            await Notification.create({

                recipient: donor._id,

                message:
                    `Emergency ${bloodGroup} blood request at ${hospitalName}. ${unitsRequired} unit(s) required. Request expires in 6 hours.`,

                type: "EMERGENCY_REQUEST",

                emergencyRequest: request._id,

                isRead: false
            });
        }


        // ==========================================
        // Response
        // ==========================================

        return res.status(201).json({

            success: true,

            message: "Emergency Request Created",

            request,

            notifiedDonors: donors.length
        });


    } catch (err) {

        console.log(
            "Create Emergency Request Error:",
            err
        );

        return res.status(500).json({

            success: false,

            message:
                "Error in create emergency request"
        });
    }
};


// ======================================================
// GET ALL EMERGENCY REQUESTS
// ======================================================

const getAllEmergencyRequests = async (req, res) => {

    try {

        const filter = {};


        if (req.query.bloodGroup) {

            filter.bloodGroup =
                req.query.bloodGroup;
        }


        if (req.query.status) {

            filter.status =
                req.query.status;
        }


        const requests =
            await EmergencyRequest
                .find(filter)

                .populate(
                    "patient",
                    "name email phone bloodGroup location"
                )

                .populate(
                    "donor",
                    "name email phone bloodGroup"
                )

                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            total: requests.length,

            requests
        });


    } catch (err) {

        console.log(
            "Get All Emergency Requests Error:",
            err
        );

        return res.status(500).json({

            success: false,

            message:
                "Error in get all emergency requests"
        });
    }
};


// ======================================================
// GET EMERGENCY REQUEST BY ID
// ======================================================

const getEmergencyRequestById = async (req, res) => {

    try {

        const request =
            await EmergencyRequest

                .findById(req.params.id)

                .populate(
                    "patient",
                    "name email phone bloodGroup location"
                )

                .populate(
                    "donor",
                    "name email phone bloodGroup"
                );


        if (!request) {

            return res.status(404).json({

                success: false,

                message:
                    "Emergency request not found"
            });
        }


        return res.status(200).json({

            success: true,

            request
        });


    } catch (err) {

        console.log(
            "Get Emergency Request Error:",
            err
        );

        return res.status(500).json({

            success: false,

            message:
                "Error in get emergency request"
        });
    }
};


// ======================================================
// GET MY EMERGENCY REQUESTS
// ======================================================

const getMyEmergencyRequests = async (req, res) => {

    try {

        const requests =
            await EmergencyRequest

                .find({
                    patient: req.user.id
                })

                .populate(
                    "donor",
                    "name email phone bloodGroup"
                )

                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            requests
        });


    } catch (error) {

        console.log(
            "Get My Emergency Requests Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message
        });
    }
};


// ======================================================
// UPDATE REQUEST STATUS
// ======================================================

const updateRequestStatus = async (req, res) => {

    try {

        const { status } = req.body;


        const request =
            await EmergencyRequest
                .findById(req.params.id);


        if (!request) {

            return res.status(404).json({

                success: false,

                message: "Request not found"
            });
        }


        request.status = status;

        await request.save();


        return res.status(200).json({

            success: true,

            message:
                "Status updated successfully"
        });


    } catch (err) {

        console.log(
            "Update Request Status Error:",
            err
        );

        return res.status(500).json({

            success: false,

            message:
                "Error in update emergency request"
        });
    }
};


// ======================================================
// ACCEPT EMERGENCY REQUEST
// ======================================================

const acceptEmergencyRequest = async (req, res) => {

    try {

        const request =
            await EmergencyRequest
                .findById(req.params.id);


        // ==========================================
        // Request doesn't exist
        // ==========================================

        if (!request) {

            return res.status(404).json({

                success: false,

                message: "Request not found"
            });
        }


        // ==========================================
        // CHECK 6-HOUR EXPIRY
        // ==========================================

        if (
            request.status === "Pending" &&
            new Date() > new Date(request.expiresAt)
        ) {

            request.status = "Expired";

            await request.save();


            // Notify patient about expiry
            await Notification.create({

                recipient: request.patient,

                message:
                    `Your emergency ${request.bloodGroup} blood request has expired.`,

                type: "REQUEST_EXPIRED",

                emergencyRequest: request._id,

                isRead: false
            });


            return res.status(400).json({

                success: false,

                message:
                    "This emergency request has expired"
            });
        }


        // ==========================================
        // Check status
        // ==========================================

        if (request.status !== "Pending") {

            return res.status(400).json({

                success: false,

                message:
                    "Request already processed"
            });
        }


        // ==========================================
        // Accept request
        // ==========================================

        request.status = "Accepted";

        request.donor = req.user.id;

        request.acceptedAt = new Date();


        await request.save();


        // ==========================================
        // Notify patient
        // ==========================================

        const donor =
            await User.findById(req.user.id)
                .select("name");


        await Notification.create({

            recipient: request.patient,

            message:
                `${donor?.name || "A donor"} has accepted your ${request.bloodGroup} blood request.`,

            type: "REQUEST_ACCEPTED",

            emergencyRequest: request._id,

            isRead: false
        });


        return res.status(200).json({

            success: true,

            message:
                "Request accepted",

            request
        });


    } catch (err) {

        console.log(
            "Accept Emergency Request Error:",
            err
        );

        return res.status(500).json({

            success: false,

            message: err.message
        });
    }
};


// ======================================================
// REJECT EMERGENCY REQUEST
// ======================================================

const rejectEmergencyRequest = async (req, res) => {

    try {

        const request =
            await EmergencyRequest
                .findById(req.params.id);


        if (!request) {

            return res.status(404).json({

                success: false,

                message: "Request not found"
            });
        }


        // ==========================================
        // Don't allow rejection after expiry
        // ==========================================

        if (
            request.status === "Pending" &&
            new Date() > new Date(request.expiresAt)
        ) {

            request.status = "Expired";

            await request.save();


            await Notification.create({

                recipient: request.patient,

                message:
                    `Your emergency ${request.bloodGroup} blood request has expired.`,

                type: "REQUEST_EXPIRED",

                emergencyRequest: request._id,

                isRead: false
            });


            return res.status(400).json({

                success: false,

                message:
                    "This emergency request has expired"
            });
        }


        // ==========================================
        // Reject request
        // ==========================================

        request.status = "Cancelled";

        request.donor = req.user.id;


        await request.save();


        // ==========================================
        // Notify patient
        // ==========================================

        const donor =
            await User.findById(req.user.id)
                .select("name");


        await Notification.create({

            recipient: request.patient,

            message:
                `${donor?.name || "A donor"} has rejected your ${request.bloodGroup} blood request.`,

            type: "REQUEST_REJECTED",

            emergencyRequest: request._id,

            isRead: false
        });


        return res.status(200).json({

            success: true,

            message:
                "Request rejected successfully"
        });


    } catch (err) {

        console.log(
            "Reject Emergency Request Error:",
            err
        );

        return res.status(500).json({

            success: false,

            message: err.message
        });
    }
};


// ======================================================
// COMPLETE DONATION
// ======================================================

const completeDonation = async (req, res) => {

    try {

        const request =
            await EmergencyRequest
                .findById(req.params.id);


        // ==========================================
        // Request doesn't exist
        // ==========================================

        if (!request) {

            return res.status(404).json({

                success: false,

                message: "Request not found"
            });
        }


        // ==========================================
        // Must be accepted first
        // ==========================================

        if (request.status !== "Accepted") {

            return res.status(400).json({

                success: false,

                message:
                    "Request must be accepted first"
            });
        }


        // ==========================================
        // Donor check
        // ==========================================

        if (!request.donor) {

            return res.status(400).json({

                success: false,

                message:
                    "No donor has accepted this request"
            });
        }


        // ==========================================
        // Complete donation
        // ==========================================

        request.status = "Completed";

        request.completedAt = new Date();


        await request.save();


        // ==========================================
        // Create donation history
        // ==========================================

        await Donation.create({

            donor: request.donor,

            patient: request.patient,

            emergencyRequest: request._id
        });


        // ==========================================
        // Notify patient
        // ==========================================

        await Notification.create({

            recipient: request.patient,

            message:
                `Your ${request.bloodGroup} blood donation request has been completed successfully.`,

            type: "REQUEST_COMPLETED",

            emergencyRequest: request._id,

            isRead: false
        });


        // ==========================================
        // Notify donor
        // ==========================================

        await Notification.create({

            recipient: request.donor,

            message:
                `Your donation for the ${request.bloodGroup} emergency request has been completed successfully.`,

            type: "REQUEST_COMPLETED",

            emergencyRequest: request._id,

            isRead: false
        });


        return res.status(200).json({

            success: true,

            message:
                "Donation completed"
        });


    } catch (err) {

        console.log(
            "Complete Donation Error:",
            err
        );

        return res.status(500).json({

            success: false,

            message: err.message
        });
    }
};


// ======================================================
// AI DONOR RECOMMENDATION
// ======================================================

const recommendDonors = async (req, res) => {

    try {

        const { bloodGroup } = req.body;


        // ==========================================
        // Validate blood group
        // ==========================================

        if (!bloodGroup) {

            return res.status(400).json({

                success: false,

                message: "Blood group is required"
            });
        }


        // ==========================================
        // Find available matching donors
        // ==========================================

        const donors = await User.find({

            role: "donor",

            bloodGroup: bloodGroup,

            availability: true

        }).select(
            "name email phone bloodGroup location lastDonation responseRate"
        );


        const recommendedDonors = [];


        // ==========================================
        // Send every donor to AI
        // ==========================================

        for (const donor of donors) {

            // ==========================================
            // Calculate days since last donation
            // ==========================================

            let daysSinceDonation = 365;


            if (donor.lastDonation) {

                const today = new Date();

                const lastDonation =
                    new Date(donor.lastDonation);


                const difference =
                    today - lastDonation;


                daysSinceDonation =
                    Math.floor(
                        difference /
                        (1000 * 60 * 60 * 24)
                    );
            }


            // ==========================================
            // Temporary distance
            // ==========================================

            const distance = 5;


            // ==========================================
            // Donor response rate
            // ==========================================

            const responseRate =
                donor.responseRate || 0.5;


            // ==========================================
            // Call Python AI service
            // ==========================================

            const aiResult =
                await getDonorPrediction(
                    distance,
                    daysSinceDonation,
                    responseRate
                );


            // ==========================================
            // Add donor + prediction
            // ==========================================

            recommendedDonors.push({

                donor: donor,

                score:
                    aiResult?.score || 0,

                prediction:
                    aiResult?.prediction || 0
            });
        }


        // ==========================================
        // Highest score first
        // ==========================================

        recommendedDonors.sort(
            (a, b) => b.score - a.score
        );


        // ==========================================
        // Send response
        // ==========================================

        return res.status(200).json({

            success: true,

            total:
                recommendedDonors.length,

            donors:
                recommendedDonors
        });


    } catch (error) {

        console.log(
            "AI Recommendation Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to recommend donors"
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    createEmergencyRequest,

    getAllEmergencyRequests,

    getEmergencyRequestById,

    updateRequestStatus,

    rejectEmergencyRequest,

    acceptEmergencyRequest,

    completeDonation,

    getMyEmergencyRequests,

    recommendDonors
};