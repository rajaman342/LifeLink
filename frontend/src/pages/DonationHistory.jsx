import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

function DonationHistory() {

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const response = await axiosInstance.get(
                    "/donor/donation-history"
                );

                setHistory(
                    response.data.history || []
                );

            } catch (error) {

                console.log(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to fetch donation history"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchHistory();

    }, []);

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p>
                    Loading donation history...
                </p>

            </div>
        );

    }

    if (error) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p className="text-red-600">
                    {error}
                </p>

            </div>
        );

    }

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold text-gray-800">
                    Donation History
                </h1>

                <p className="text-gray-500 mt-2">
                    Your previous blood donation records.
                </p>


                {history.length === 0 ? (

                    <div className="bg-white rounded-xl shadow mt-8 p-10 text-center">

                        <p className="text-gray-500">
                            No donation history available.
                        </p>

                    </div>

                ) : (

                    <div className="mt-8 space-y-5">

                        {history.map((donation) => (

                            <div
                                key={donation._id}
                                className="bg-white rounded-xl shadow p-6"
                            >

                                <div className="flex justify-between items-center">

                                    <h2 className="text-xl font-bold text-red-600">

                                        {donation.bloodGroup}

                                    </h2>

                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                                        Completed

                                    </span>

                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                                    <p>
                                        <strong>
                                            Hospital:
                                        </strong>{" "}
                                        {donation.hospitalName}
                                    </p>

                                    <p>
                                        <strong>
                                            Units:
                                        </strong>{" "}
                                        {donation.unitsRequired}
                                    </p>

                                    <p>
                                        <strong>
                                            Date:
                                        </strong>{" "}

                                        {donation.completedAt
                                            ? new Date(
                                                donation.completedAt
                                            ).toLocaleDateString()
                                            : "N/A"}

                                    </p>

                                    <p>
                                        <strong>
                                            Contact:
                                        </strong>{" "}
                                        {donation.contactNumber}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );
}

export default DonationHistory;