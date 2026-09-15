import { useState } from "react";
import axiosInstance from "../services/axiosInstance";

function RecommendedDonors({ bloodGroup }) {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getRecommendations = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosInstance.post(
                "/emergency/recommend",
                {
                    bloodGroup
                }
            );

            setDonors(response.data.donors || []);

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to get donor recommendations"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8">

            <button
                onClick={getRecommendations}
                disabled={!bloodGroup || loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
            >
                {loading
                    ? "Finding Best Donors..."
                    : "Find Best Donors"}
            </button>

            {error && (
                <p className="text-red-600 mt-4">
                    {error}
                </p>
            )}

            {donors.length > 0 && (
                <div className="mt-6">

                    <h2 className="text-2xl font-bold text-gray-800">
                        AI Recommended Donors
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                        {donors.map((item) => (

                            <div
                                key={item.donor._id}
                                className="bg-white p-5 rounded-xl shadow"
                            >

                                <div className="flex justify-between items-center">

                                    <h3 className="text-xl font-bold">
                                        {item.donor.name}
                                    </h3>

                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                        Score: {item.score}
                                    </span>

                                </div>

                                <div className="mt-4 space-y-2">

                                    <p>
                                        <strong>Blood Group:</strong>{" "}
                                        {item.donor.bloodGroup}
                                    </p>

                                    <p>
                                        <strong>Email:</strong>{" "}
                                        {item.donor.email}
                                    </p>

                                    <p>
                                        <strong>Phone:</strong>{" "}
                                        {item.donor.phone}
                                    </p>

                                    <p>
                                        <strong>Prediction:</strong>{" "}
                                        {item.prediction === 1
                                            ? "Likely to Respond"
                                            : "Less Likely to Respond"}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>
            )}

        </div>
    );
}

export default RecommendedDonors;