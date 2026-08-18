import { useEffect, useState } from "react";

import axiosInstance from "../services/axiosInstance";


function HospitalDashboard() {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState(null);


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
                "Failed to load emergency requests"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchRequests();

    }, []);


    const handleComplete = async (id) => {

        try {

            setActionLoading(id);

            const response = await axiosInstance.put(
                `/emergency/complete/${id}`
            );

            if (response.data.success) {

                setRequests((previousRequests) =>
                    previousRequests.map((request) =>
                        request._id === id
                            ? {
                                ...request,
                                status: "Completed"
                            }
                            : request
                    )
                );

            }

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to complete donation"
            );

        } finally {

            setActionLoading(null);

        }

    };


    const pendingRequests = requests.filter(
        request => request.status === "Pending"
    );

    const acceptedRequests = requests.filter(
        request => request.status === "Accepted"
    );

    const completedRequests = requests.filter(
        request => request.status === "Completed"
    );


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p>
                    Loading hospital dashboard...
                </p>

            </div>
        );

    }


    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-7xl mx-auto">


                {/* Header */}

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">

                        Hospital Dashboard

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Manage emergency blood requests and donations.

                    </p>

                </div>


                {/* Error */}

                {error && (

                    <div className="mt-6 bg-red-100 text-red-600 p-4 rounded-lg">

                        {error}

                    </div>

                )}


                {/* Statistics */}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">


                    <div className="bg-white p-6 rounded-xl shadow">

                        <p className="text-gray-500">
                            Total Requests
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {requests.length}
                        </h2>

                    </div>


                    <div className="bg-white p-6 rounded-xl shadow">

                        <p className="text-gray-500">
                            Pending
                        </p>

                        <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                            {pendingRequests.length}
                        </h2>

                    </div>


                    <div className="bg-white p-6 rounded-xl shadow">

                        <p className="text-gray-500">
                            Accepted
                        </p>

                        <h2 className="text-3xl font-bold text-green-600 mt-2">
                            {acceptedRequests.length}
                        </h2>

                    </div>


                    <div className="bg-white p-6 rounded-xl shadow">

                        <p className="text-gray-500">
                            Completed
                        </p>

                        <h2 className="text-3xl font-bold text-blue-600 mt-2">
                            {completedRequests.length}
                        </h2>

                    </div>

                </div>


                {/* Requests */}

                <div className="mt-10">

                    <h2 className="text-2xl font-bold text-gray-800">

                        Emergency Blood Requests

                    </h2>


                    {!loading &&
                        requests.length === 0 && (

                            <div className="bg-white p-8 rounded-xl shadow mt-5 text-center">

                                <p className="text-gray-500">

                                    No emergency requests available.

                                </p>

                            </div>

                        )}


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">


                        {requests.map((request) => (

                            <div
                                key={request._id}
                                className="bg-white rounded-xl shadow p-6"
                            >


                                {/* Header */}

                                <div className="flex justify-between items-center">

                                    <h3 className="text-2xl font-bold text-red-600">

                                        {request.bloodGroup}

                                    </h3>


                                    <span className="px-3 py-1 rounded-full bg-gray-100">

                                        {request.status}

                                    </span>

                                </div>


                                {/* Details */}

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


                                {/* Patient */}

                                {request.patient && (

                                    <div className="border-t mt-5 pt-5">

                                        <h4 className="font-bold">

                                            Patient Information

                                        </h4>

                                        <p className="mt-2">

                                            <strong>
                                                Name:
                                            </strong>{" "}

                                            {request.patient.name}

                                        </p>

                                        <p>

                                            <strong>
                                                Phone:
                                            </strong>{" "}

                                            {request.patient.phone}

                                        </p>

                                    </div>

                                )}


                                {/* Donor */}

                                {request.donor && (

                                    <div className="border-t mt-5 pt-5">

                                        <h4 className="font-bold">

                                            Donor Information

                                        </h4>

                                        <p className="mt-2">

                                            <strong>
                                                Name:
                                            </strong>{" "}

                                            {request.donor.name}

                                        </p>

                                        <p>

                                            <strong>
                                                Blood Group:
                                            </strong>{" "}

                                            {request.donor.bloodGroup}

                                        </p>

                                        <p>

                                            <strong>
                                                Phone:
                                            </strong>{" "}

                                            {request.donor.phone}

                                        </p>

                                    </div>

                                )}


                                {/* Complete Button */}

                                {request.status === "Accepted" && (

                                    <button
                                        onClick={() =>
                                            handleComplete(request._id)
                                        }
                                        disabled={
                                            actionLoading === request._id
                                        }
                                        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                    >

                                        {actionLoading === request._id
                                            ? "Completing..."
                                            : "Mark Donation Completed"}

                                    </button>

                                )}


                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default HospitalDashboard;