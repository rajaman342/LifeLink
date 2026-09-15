const axios = require("axios");

const getDonorScore = async ({
    distance,
    days_since_donation,
    response_rate
}) => {

    try {

        const response = await axios.post(
            "http://localhost:5001/predict",
            {
                distance,
                days_since_donation,
                response_rate
            }
        );

        return response.data;

    } catch (error) {

        console.log(
            "AI Service Error:",
            error.response?.data || error.message
        );

        throw new Error("AI service unavailable");
    }
};

module.exports = {
    getDonorScore
};