import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function PatientDashboard() {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Stores recommended donors for each request
    const [recommendations, setRecommendations] = useState({});

    // Loading state for individual request
    const [recommendLoading, setRecommendLoading] = useState({});

    const [error, setError] = useState("");

    // ==========================================
    // GET PATIENT REQUESTS
    // ==========================================

    const fetchMyRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosInstance.get(
                "/emergency/my-requests"
            );

            console.log("My Requests:", response.data);

            if (response.data.success) {
                setRequests(response.data.requests || []);
            } else {
                setError("Failed to load requests");
            }
        } catch (error) {
            console.error("Fetch requests error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load emergency requests"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOAD REQUESTS ON PAGE LOAD
    // ==========================================

    useEffect(() => {
        fetchMyRequests();
    }, []);

    // ==========================================
    // FIND AI RECOMMENDED DONORS
    // ==========================================

    const findAvailableDonors = async (request) => {
        try {
            setRecommendLoading((prev) => ({
                ...prev,
                [request._id]: true,
            }));

            setError("");

            console.log(
                "Finding donors for blood group:",
                request.bloodGroup
            );

            const response = await axiosInstance.post(
                "/emergency/recommend",
                {
                    bloodGroup: request.bloodGroup,
                }
            );

            console.log("AI Recommendation Response:", response.data);

            if (response.data.success) {
                setRecommendations((prev) => ({
                    ...prev,
                    [request._id]: response.data.donors || [],
                }));
            } else {
                setRecommendations((prev) => ({
                    ...prev,
                    [request._id]: [],
                }));
            }
        } catch (error) {
            console.error("Recommendation error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to find available donors"
            );
        } finally {
            setRecommendLoading((prev) => ({
                ...prev,
                [request._id]: false,
            }));
        }
    };

    // ==========================================
    // STATUS COLOR
    // ==========================================

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "accepted":
                return "bg-green-100 text-green-700";

            case "completed":
                return "bg-blue-100 text-blue-700";

            case "rejected":
                return "bg-red-100 text-red-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    // ==========================================
    // STATISTICS
    // ==========================================

    const totalRequests = requests.length;

    const pendingRequests = requests.filter(
        (request) =>
            request.status?.toLowerCase() === "pending"
    ).length;

    const acceptedRequests = requests.filter(
        (request) =>
            request.status?.toLowerCase() === "accepted"
    ).length;

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-600">
                    Loading your emergency requests...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Welcome, Golu 👋
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Manage your emergency blood requests.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/create-emergency-request")
                        }
                        className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        + Create Emergency Request
                    </button>

                </div>

                {/* =========================================
                    ERROR
                ========================================= */}

                {error && (
                    <div className="mb-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
                        {error}
                    </div>
                )}

                {/* =========================================
                    STATISTICS
                ========================================= */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">
                            Total Requests
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {totalRequests}
                        </h2>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">
                            Pending
                        </p>

                        <h2 className="text-3xl font-bold mt-2 text-yellow-600">
                            {pendingRequests}
                        </h2>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">
                            Accepted
                        </p>

                        <h2 className="text-3xl font-bold mt-2 text-green-600">
                            {acceptedRequests}
                        </h2>
                    </div>

                </div>

                {/* =========================================
                    REQUESTS
                ========================================= */}

                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    My Emergency Requests
                </h2>

                {requests.length === 0 ? (

                    <div className="bg-white rounded-xl shadow p-10 text-center">

                        <p className="text-gray-500 text-lg">
                            You have not created any emergency requests yet.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/create-emergency-request")
                            }
                            className="mt-5 bg-red-600 text-white px-6 py-3 rounded-lg"
                        >
                            Create Request
                        </button>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {requests.map((request) => {

                            const donors =
                                recommendations[request._id] || [];

                            const isLoading =
                                recommendLoading[request._id];

                            return (

                                <div
                                    key={request._id}
                                    className="bg-white rounded-xl shadow p-5"
                                >

                                    {/* =================================
                                        REQUEST HEADER
                                    ================================= */}

                                    <div className="flex justify-between items-start">

                                        <h3 className="text-2xl font-bold text-red-600">
                                            {request.bloodGroup}
                                        </h3>

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                                                request.status
                                            )}`}
                                        >
                                            {request.status}
                                        </span>

                                    </div>

                                    {/* =================================
                                        REQUEST DETAILS
                                    ================================= */}

                                    <div className="mt-6 space-y-3">

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

                                        <p className="text-sm text-gray-500">
                                            Created:{" "}
                                            {request.createdAt
                                                ? new Date(
                                                    request.createdAt
                                                ).toLocaleDateString()
                                                : "N/A"}
                                        </p>

                                    </div>

                                    {/* =================================
                                        FIND DONORS BUTTON
                                    ================================= */}

                                    {request.status?.toLowerCase() ===
                                        "pending" && (

                                        <button
                                            onClick={() =>
                                                findAvailableDonors(request)
                                            }
                                            disabled={isLoading}
                                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
                                        >

                                            {isLoading
                                                ? "Finding Donors..."
                                                : "🤖 Find Available Donors"}

                                        </button>

                                    )}

                                    {/* =================================
                                        AI DONORS
                                    ================================= */}

                                    {recommendations[request._id] && (

                                        <div className="mt-6 border-t pt-5">

                                            <div className="flex justify-between items-center mb-4">

                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        Available Donors
                                                    </h3>

                                                    <p className="text-sm text-gray-500">
                                                        AI-recommended donors
                                                    </p>
                                                </div>

                                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                    {donors.length} Found
                                                </span>

                                            </div>

                                            {/* =================================
                                                NO DONORS
                                            ================================= */}

                                            {donors.length === 0 ? (

                                                <div className="bg-gray-100 p-4 rounded-lg text-center">

                                                    <p className="text-gray-500">
                                                        No available donors found.
                                                    </p>

                                                </div>

                                            ) : (

                                                <div className="space-y-3">

                                                    {donors.map(
                                                        (item, index) => {

                                                            const donor =
                                                                item.donor || item;

                                                            const score =
                                                                item.score ?? 0;

                                                            const prediction =
                                                                item.prediction;

                                                            return (

                                                                <div
                                                                    key={
                                                                        donor._id ||
                                                                        index
                                                                    }
                                                                    className="border border-gray-300 rounded-lg p-4"
                                                                >

                                                                    <div className="flex justify-between">

                                                                        <div className="flex gap-3">

                                                                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                                                                {index + 1}
                                                                            </div>

                                                                            <div>

                                                                                <h4 className="font-bold text-lg">
                                                                                    {
                                                                                        donor.name
                                                                                    }
                                                                                </h4>

                                                                                <p className="text-sm">
                                                                                    <strong>
                                                                                        Blood Group:
                                                                                    </strong>{" "}
                                                                                    <span className="text-red-600 font-semibold">
                                                                                        {
                                                                                            donor.bloodGroup
                                                                                        }
                                                                                    </span>
                                                                                </p>

                                                                                <p className="text-sm">
                                                                                    <strong>
                                                                                        Phone:
                                                                                    </strong>{" "}
                                                                                    {
                                                                                        donor.phone ||
                                                                                        "N/A"
                                                                                    }
                                                                                </p>

                                                                                <p className="text-sm">
                                                                                    <strong>
                                                                                        Email:
                                                                                    </strong>{" "}
                                                                                    {
                                                                                        donor.email ||
                                                                                        "N/A"
                                                                                    }
                                                                                </p>

                                                                                {donor.location?.city && (

                                                                                    <p className="text-sm">
                                                                                        <strong>
                                                                                            Location:
                                                                                        </strong>{" "}
                                                                                        {
                                                                                            donor
                                                                                                .location
                                                                                                .city
                                                                                        }
                                                                                    </p>

                                                                                )}

                                                                            </div>

                                                                        </div>

                                                                        {/* SCORE */}

                                                                        <div className="text-center">

                                                                            <div className="bg-green-100 px-4 py-2 rounded-lg">

                                                                                <p className="text-xs text-green-700">
                                                                                    Match Score
                                                                                </p>

                                                                                <p className="text-2xl font-bold text-green-600">
                                                                                    {score}
                                                                                </p>

                                                                            </div>

                                                                            {prediction !==
                                                                                undefined && (

                                                                                <p className="text-xs text-gray-500 mt-2">
                                                                                    AI Prediction:{" "}
                                                                                    {
                                                                                        prediction
                                                                                    }
                                                                                </p>

                                                                            )}

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            );
                                                        }
                                                    )}

                                                </div>

                                            )}

                                        </div>

                                    )}

                                    {/* =================================
                                        ASSIGNED DONOR
                                    ================================= */}

                                    {request.donor && (

                                        <div className="mt-6 border-t pt-5">

                                            <h3 className="text-lg font-bold mb-3">
                                                Donor Assigned
                                            </h3>

                                            <div className="bg-green-50 p-4 rounded-lg">

                                                <p>
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

                                                <p>
                                                    <strong>
                                                        Email:
                                                    </strong>{" "}
                                                    {request.donor.email}
                                                </p>

                                            </div>

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

export default PatientDashboard;