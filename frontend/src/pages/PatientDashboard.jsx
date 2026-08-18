import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";


function PatientDashboard() {

    const { user } = useAuth();

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const fetchMyRequests = async () => {

        try {

            setLoading(true);

            const response = await axiosInstance.get(
                "/emergency/my-requests"
            );

            setRequests(
                response.data.requests || []
            );

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load your requests"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchMyRequests();

    }, []);


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

        default:
            return "bg-gray-100 text-gray-700";
    }

};

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-6xl mx-auto">


                {/* Header */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                        <h1 className="text-3xl font-bold text-gray-800">

                            Welcome, {user?.name} 👋

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Manage your emergency blood requests.

                        </p>

                    </div>


                    <Link
                        to="/create-emergency"
                        className="bg-red-600 text-white px-6 py-3 rounded-lg text-center hover:bg-red-700"
                    >

                        + Create Emergency Request

                    </Link>

                </div>


                {/* Statistics */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">


                    <div className="bg-white p-6 rounded-xl shadow">

                        <p className="text-gray-500">
                            Total Requests
                        </p>

                        <h2 className="text-3xl font-bold text-gray-800 mt-2">

                            {requests.length}

                        </h2>

                    </div>


                    <div className="bg-white p-6 rounded-xl shadow">

                        <p className="text-gray-500">
                            Pending
                        </p>

                        <h2 className="text-3xl font-bold text-yellow-600 mt-2">

                            {
                                requests.filter(
                                    request =>
                                        request.status === "Pending"
                                ).length
                            }

                        </h2>

                    </div>


                    <div className="bg-white p-6 rounded-xl shadow">

                        <p className="text-gray-500">
                            Accepted
                        </p>

                        <h2 className="text-3xl font-bold text-green-600 mt-2">

                            {
                                requests.filter(
                                    request =>
                                        request.status === "Accepted"
                                ).length
                            }

                        </h2>

                    </div>

                </div>


                {/* Requests */}

                <div className="mt-10">

                    <h2 className="text-2xl font-bold text-gray-800">

                        My Emergency Requests

                    </h2>


                    {loading && (

                        <div className="bg-white p-8 rounded-xl shadow mt-5 text-center">

                            <p className="text-gray-500">

                                Loading your requests...

                            </p>

                        </div>

                    )}


                    {error && (

                        <div className="bg-red-100 text-red-600 p-4 rounded-lg mt-5">

                            {error}

                        </div>

                    )}


                    {!loading &&
                        !error &&
                        requests.length === 0 && (

                            <div className="bg-white p-8 rounded-xl shadow mt-5 text-center">

                                <p className="text-gray-500">

                                    You haven't created any emergency requests yet.

                                </p>

                                <Link
                                    to="/create-emergency"
                                    className="inline-block mt-4 bg-red-600 text-white px-5 py-2 rounded-lg"
                                >

                                    Create Your First Request

                                </Link>

                            </div>

                        )}


                    {!loading &&
                        !error &&
                        requests.length > 0 && (

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">

                                {requests.map((request) => (

                                    <div
                                        key={request._id}
                                        className="bg-white rounded-xl shadow p-6"
                                    >


                                        {/* Request Header */}

                                        <div className="flex justify-between items-center">

                                            <h3 className="text-2xl font-bold text-red-600">

                                                {request.bloodGroup}

                                            </h3>


                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                                                    request.status
                                                )}`}
                                            >

                                                {request.status}

                                            </span>

                                        </div>


                                        {/* Request Details */}

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


                                            <p className="text-sm text-gray-500 pt-2">

                                                Created:{" "}

                                                {new Date(
                                                    request.createdAt
                                                ).toLocaleDateString()}

                                            </p>

                                        </div>


                                        {/* Donor Information */}

                                        {request.donor && (

                                            <div className="mt-5 border-t pt-5">

                                                <h4 className="font-bold text-gray-800">

                                                    Donor Assigned

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


                                    </div>

                                ))}

                            </div>

                        )}

                </div>

            </div>

        </div>

    );

}

export default PatientDashboard;