const getDonorPrediction = require("./utils/aiPrediction");

const testAI = async () => {

    try {

        console.log("Sending data to AI service...");

        const result = await getDonorPrediction(
            3,      // distance in km
            120,    // days since last donation
            0.85    // donor response rate
        );

        console.log("\nAI RESULT:");
        console.log(result);

    } catch (error) {

        console.log("\nError while calling AI service:");
        console.log(error.message);

    }

};

testAI();