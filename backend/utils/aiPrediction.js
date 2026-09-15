const axios = require("axios");

const getDonorPrediction = async (
    distance,
    daysSinceDonation,
    responseRate
) => {

    try {

        const response = await axios.post(
            "http://localhost:5001/predict",
            {
                distance,
                days_since_donation: daysSinceDonation,
                response_rate: responseRate
            }
        );

        return response.data;

    } catch (error) {

        console.log(
            "AI Service Error:",
            error.response?.data || error.message
        );

        return null;
    }
};

module.exports = getDonorPrediction;