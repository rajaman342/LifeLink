import { useEffect, useState } from "react";

import axiosInstance from "../services/axiosInstance";

function DonorRequests() {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState(null);

    // Used to refresh countdown every minute
    const [currentTime, setCurrentTime] = useState(new Date());


    // --------------------------------
    // Fetch Requests
    // --------------------------------

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


    // --------------------------------
    // Countdown Timer
    // --------------------------------

    useEffect(() => {

        const timer = setInterval(() => {

            setCurrentTime(new Date());

        }, 60000);

        return () => {

            clearInterval(timer);

        };

    }, []);


    // --------------------------------
    // Calculate Remaining Time
    // --------------------------------

    const calculateTimeRemaining = (expiresAt) => {

        if (!expiresAt) {

            return "No expiry time";

        }

        const difference =
            new Date(expiresAt).getTime() -
            currentTime.getTime();


        if (difference <= 0) {

            return "Expired";

        }


        const hours = Math.floor(
            difference /
            (1000 * 60 * 60)
        );


        const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) /
            (1000 * 60)
        );


        return `${hours}h ${minutes}m`;

    };


    // --------------------------------
    // Accept Request
    // --------------------------------

    const handleAccept = async (id) => {

        try {

            setActionLoading(id);

            const response =
                await axiosInstance.put(
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


    // --------------------------------
    // Reject Request
    // --------------------------------

    const handleReject = async (id) => {

        try {

            setActionLoading(id);

            const response =
                await axiosInstance.put(
                    `/emergency/reject/${id}`
                );

            console.log(response.data);


            setRequests((previousRequests) =>

                previousRequests.map((request) =>

                    request._id === id

                        ? {
                            ...request,
                            status: "Cancelled"
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


    // --------------------------------
    // Status Badge
    // --------------------------------

    const getStatusClass = (status) => {

        switch (status) {

            case "Pending":

                return "bg-yellow-100 text-yellow-700";


            case "Accepted":

                return "bg-green-100 text-green-700";


            case "Completed":

                return "bg-blue-100 text-blue-700";


            case "Cancelled":

                return "bg-red-100 text-red-700";


            case "Expired":

                return "bg-gray-200 text-gray-700";


            default:

                return "bg-gray-100 text-gray-700";

        }

    };


    // --------------------------------
    // Loading
    // --------------------------------

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <div className="flex flex-col items-center">

                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>

                    <p className="text-gray-600 mt-4">
                        Loading emergency requests...
                    </p>

                </div>

            </div>

        );

    }


    // --------------------------------
    // Error
    // --------------------------------

    if (error) {

        return (

            <div className="min-h-screen flex items-center justify-center px-4">

                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-center">

                    <p>
                        Unable to load emergency requests.
                    </p>

                    <p className="mt-1">
                        Please try again.
                    </p>

                </div>

            </div>

        );

    }


    // --------------------------------
    // UI
    // --------------------------------

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-6xl mx-auto">


                {/* Heading */}

                <h1 className="text-3xl font-bold text-gray-800">

                    Emergency Blood Requests

                </h1>


                <p className="text-gray-500 mt-2">

                    Requests requiring blood donors.

                </p>


                {/* Empty State */}

                {requests.length === 0 ? (

                    <div className="bg-white rounded-2xl shadow-sm border p-10 text-center mt-8">

                        <div className="text-5xl mb-4">
                            🩸
                        </div>

                        <h3 className="text-xl font-bold text-gray-800">

                            No Emergency Requests

                        </h3>

                        <p className="text-gray-500 mt-2">

                            There are currently no matching blood requests.

                        </p>

                    </div>

                ) : (


                    /* Request Cards */

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">


                        {requests.map((request) => {


                            const remainingTime =
                                calculateTimeRemaining(
                                    request.expiresAt
                                );


                            const isExpired =
                                remainingTime === "Expired";


                            return (

                                <div
                                    key={request._id}
                                    className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition"
                                >


                                    {/* Header */}

                                    <div className="flex justify-between items-center">


                                        <h2 className="text-xl font-bold text-red-600">

                                            {request.bloodGroup}

                                        </h2>


                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                                                request.status
                                            )}`}
                                        >

                                            {request.status}

                                        </span>

                                    </div>


                                    {/* Request Information */}

                                    <div className="mt-5 space-y-3">


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


                                    {/* Countdown */}

                                    {request.status === "Pending" && (

                                        <div className="mt-5">


                                            {isExpired ? (

                                                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3">

                                                    ⏰ Request Expired

                                                </div>

                                            ) : (

                                                <div className="bg-orange-50 border border-orange-200 text-orange-600 rounded-lg p-3">

                                                    ⏰ Time remaining:{" "}

                                                    <span className="font-semibold">

                                                        {remainingTime}

                                                    </span>

                                                </div>

                                            )}

                                        </div>

                                    )}


                                    {/* Buttons */}

                                    {request.status === "Pending" &&
                                        !isExpired && (

                                            <div className="mt-6 flex gap-3">


                                                {/* Accept */}

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
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
                                                >

                                                    {actionLoading === request._id
                                                        ? "Processing..."
                                                        : "Accept"}

                                                </button>


                                                {/* Reject */}

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
                                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
                                                >

                                                    Reject

                                                </button>


                                            </div>

                                        )}


                                </div>

                            );

                        })}


                    </div>

                )}

            </div>

        </div>

    );

}

export default DonorRequests;