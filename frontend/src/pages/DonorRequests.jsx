import { useEffect, useState } from "react";

import axiosInstance from "../services/axiosInstance";

function DonorRequests() {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState(null);


    // Fetch Requests

    const fetchRequests = async () => {

        try {

            setLoading(true);

            const response = await axiosInstance.get(
                "/emergency/all"
            );

            setRequests(
                response.data.requests || []
            );

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch emergency requests"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchRequests();

    }, []);


    // Accept Request

    const handleAccept = async (id) => {

        try {

            setActionLoading(id);

            const response = await axiosInstance.put(
                `/emergency/accept/${id}`
            );

            console.log(response.data);

            setRequests((previousRequests) =>
                previousRequests.map((request) =>
                    request._id === id
                        ? {
                            ...request,
                            status: "Accepted"
                        }
                        : request
                )
            );

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to accept request"
            );

        } finally {

            setActionLoading(null);

        }

    };


    // Reject Request

    const handleReject = async (id) => {

        try {

            setActionLoading(id);

            const response = await axiosInstance.put(
                `/emergency/reject/${id}`
            );

            console.log(response.data);

            setRequests((previousRequests) =>
                previousRequests.map((request) =>
                    request._id === id
                        ? {
                            ...request,
                            status: "Rejected"
                        }
                        : request
                )
            );

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to reject request"
            );

        } finally {

            setActionLoading(null);

        }

    };


    // Loading

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p className="text-gray-600">
                    Loading emergency requests...
                </p>

            </div>
        );

    }


    // Error

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

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold text-gray-800">

                    Emergency Blood Requests

                </h1>

                <p className="text-gray-500 mt-2">

                    Requests requiring blood donors.

                </p>


                {requests.length === 0 ? (

                    <div className="bg-white mt-8 p-8 rounded-xl shadow text-center">

                        <p className="text-gray-500">

                            No emergency requests available.

                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                        {requests.map((request) => (

                            <div
                                key={request._id}
                                className="bg-white rounded-xl shadow p-6"
                            >

                                <div className="flex justify-between items-center">

                                    <h2 className="text-xl font-bold text-red-600">

                                        {request.bloodGroup}

                                    </h2>

                                    <span
                                        className={
                                            request.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                                                : request.status === "accepted"
                                                    ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                                                    : "bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                                        }
                                    >

                                        {request.status}

                                    </span>

                                </div>


                                <div className="mt-5 space-y-2">

                                    <p>

                                        <strong>
                                            Units Required:
                                        </strong>{" "}

                                        {request.unitsRequired}

                                    </p>


                                    <p>

                                        <strong>
                                            Hospital:
                                        </strong>{" "}

                                        {request.hospitalName}

                                    </p>


                                    <p>

                                        <strong>
                                            Address:
                                        </strong>{" "}

                                        {request.hospitalAddress}

                                    </p>


                                    <p>

                                        <strong>
                                            Contact:
                                        </strong>{" "}

                                        {request.contactNumber}

                                    </p>

                                </div>


                                {request.status === "Pending" && (

                                    <div className="mt-6 flex gap-3">

                                        <button
                                            onClick={() =>
                                                handleAccept(
                                                    request._id
                                                )
                                            }
                                            disabled={
                                                actionLoading ===
                                                request._id
                                            }
                                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                                        >

                                            {actionLoading === request._id
                                                ? "Processing..."
                                                : "Accept"}

                                        </button>


                                        <button
                                            onClick={() =>
                                                handleReject(
                                                    request._id
                                                )
                                            }
                                            disabled={
                                                actionLoading ===
                                                request._id
                                            }
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-400"
                                        >

                                            Reject

                                        </button>

                                    </div>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}

export default DonorRequests;