const User = require("../models/User");
const EmergencyRequest = require("../models/EmergencyRequest");

const getDonorPrediction =
    require("../utils/aiPrediction");


// ==========================================
// Calculate days since last donation
// ==========================================

const calculateDaysSinceDonation = (lastDonation) => {

    // If donor has never donated
    if (!lastDonation) {
        return 365;
    }

    const today = new Date();

    const lastDate = new Date(lastDonation);

    const difference =
        today - lastDate;

    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );

    return days;
};


// ==========================================
// Calculate donor response rate
// ==========================================

const calculateResponseRate = async (donorId) => {

    // Requests associated with this donor
    const totalRequests =
        await EmergencyRequest.countDocuments({
            donor: donorId
        });


    // Accepted or completed requests
    const acceptedRequests =
        await EmergencyRequest.countDocuments({
            donor: donorId,

            status: {
                $in: [
                    "Accepted",
                    "Completed"
                ]
            }
        });


    // If donor has no previous requests
    if (totalRequests === 0) {

        return 0.5;

    }


    const responseRate =
        acceptedRequests / totalRequests;


    return responseRate;
};


// ==========================================
// Recommend donors
// ==========================================

const recommendDonors = async (req, res) => {

    try {

        const { bloodGroup } = req.body;


        // ==================================
        // 1. Validate blood group
        // ==================================

        if (!bloodGroup) {

            return res.status(400).json({

                success: false,

                message:
                    "Blood group is required"

            });

        }


        // ==================================
        // 2. Find available matching donors
        // ==================================

        const donors = await User.find({

            role: "donor",

            bloodGroup: bloodGroup,

            availability: true

        }).select(
            "name email phone bloodGroup location lastDonation"
        );


        const recommendedDonors = [];


        // ==================================
        // 3. Process every donor
        // ==================================

        for (const donor of donors) {


            // -------------------------------
            // Days since donation
            // -------------------------------

            const daysSinceDonation =
                calculateDaysSinceDonation(
                    donor.lastDonation
                );


            // -------------------------------
            // Response rate
            // -------------------------------

            const responseRate =
                await calculateResponseRate(
                    donor._id
                );


            // -------------------------------
            // Temporary distance
            // -------------------------------

            const distance = 5;


            // -------------------------------
            // Call AI
            // -------------------------------

            const aiResult =
                await getDonorPrediction(

                    distance,

                    daysSinceDonation,

                    responseRate

                );


            // -------------------------------
            // Add result
            // -------------------------------

            recommendedDonors.push({

                donor: donor,

                distance: distance,

                daysSinceDonation:
                    daysSinceDonation,

                responseRate:
                    responseRate,

                score:
                    aiResult?.score || 0,

                prediction:
                    aiResult?.prediction || 0

            });

        }


        // ==================================
        // 4. Sort by AI score
        // ==================================

        recommendedDonors.sort(
            (a, b) => b.score - a.score
        );


        // ==================================
        // 5. Send response
        // ==================================

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


module.exports = {

    recommendDonors

};