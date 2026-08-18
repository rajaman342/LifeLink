import { useEffect, useState } from "react";

import DonorSidebar from "../components/DonorSidebar";

import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";

function DonorDashboard() {

    const { user } = useAuth();

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await axiosInstance.get(
                    "/user/profile"
                );

                setProfile(response.data.user);

            } catch (error) {

                console.log(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load profile"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);


    // Loading State

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                <div className="text-center">

                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto">
                    </div>

                    <p className="text-gray-600 mt-4">
                        Loading dashboard...
                    </p>

                </div>

            </div>

        );

    }


    // Error State

    if (error) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md w-full">

                    <h2 className="text-xl font-bold text-red-600">
                        Unable to Load Dashboard
                    </h2>

                    <p className="text-red-500 mt-2">
                        {error}
                    </p>

                    <p className="text-gray-500 text-sm mt-3">
                        Please login again and try again.
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-gray-100">

            <div className="flex">

                {/* Sidebar */}

                <DonorSidebar />


                {/* Main Content */}

                <main className="flex-1 p-4 sm:p-6 lg:p-8">

                    {/* Heading */}

                    <div className="mb-8">

                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">

                            Welcome, {profile?.name || user?.name} 👋

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Manage your blood donation activity.

                        </p>

                    </div>


                    {/* Statistics */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">


                        {/* Blood Group */}

                        <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">

                            <p className="text-gray-500">
                                Blood Group
                            </p>

                            <h2 className="text-3xl font-bold text-red-600 mt-2">

                                {profile?.bloodGroup || "N/A"}

                            </h2>

                        </div>


                        {/* Availability */}

                        <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">

                            <p className="text-gray-500">
                                Availability
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-2">

                                {profile?.availability
                                    ? "Available"
                                    : "Not Available"}

                            </h2>

                            <span
                                className={
                                    profile?.availability
                                        ? "inline-block mt-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium"
                                        : "inline-block mt-2 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium"
                                }
                            >

                                {profile?.availability
                                    ? "Ready to donate"
                                    : "Currently unavailable"}

                            </span>

                        </div>


                        {/* Location */}

                        <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">

                            <p className="text-gray-500">
                                Location
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-2">

                                {profile?.location?.city || "N/A"}

                            </h2>

                            <p className="text-gray-500 mt-1">

                                {profile?.location?.state || "N/A"}

                            </p>

                        </div>

                    </div>


                    {/* Donor Information */}

                    <div className="bg-white rounded-2xl shadow-sm border mt-8 p-6">

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">

                            Donor Information

                        </h2>


                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">


                            {/* Name */}

                            <div>

                                <p className="text-gray-500">
                                    Full Name
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">

                                    {profile?.name || "N/A"}

                                </p>

                            </div>


                            {/* Email */}

                            <div>

                                <p className="text-gray-500">
                                    Email
                                </p>

                                <p className="font-semibold text-gray-800 mt-1 break-words">

                                    {profile?.email || "N/A"}

                                </p>

                            </div>


                            {/* Phone */}

                            <div>

                                <p className="text-gray-500">
                                    Phone
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">

                                    {profile?.phone || "N/A"}

                                </p>

                            </div>


                            {/* Blood Group */}

                            <div>

                                <p className="text-gray-500">
                                    Blood Group
                                </p>

                                <p className="font-semibold text-red-600 mt-1">

                                    {profile?.bloodGroup || "N/A"}

                                </p>

                            </div>


                            {/* City */}

                            <div>

                                <p className="text-gray-500">
                                    City
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">

                                    {profile?.location?.city || "N/A"}

                                </p>

                            </div>


                            {/* State */}

                            <div>

                                <p className="text-gray-500">
                                    State
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">

                                    {profile?.location?.state || "N/A"}

                                </p>

                            </div>


                            {/* PIN */}

                            <div>

                                <p className="text-gray-500">
                                    PIN Code
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">

                                    {profile?.location?.pin || "N/A"}

                                </p>

                            </div>


                            {/* Last Donation */}

                            <div>

                                <p className="text-gray-500">
                                    Last Donation
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">

                                    {profile?.lastDonation
                                        ? new Date(
                                            profile.lastDonation
                                        ).toLocaleDateString()
                                        : "No donation recorded"}

                                </p>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>

    );
}

export default DonorDashboard;