import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

function DonorProfile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    const fetchProfile = async () => {

        try {

            const response = await axiosInstance.get(
                "/user/profile"
            );

            setProfile(response.data.user);

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load profile"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        fetchProfile();

    }, []);

   
    const handleAvailability = async () => {

    try {

        setUpdating(true);

        const response = await axiosInstance.put(
            "/donor/availability",
            {
                availability: !profile.availability
            }
        );

        setProfile(response.data.donor);

    } catch (error) {

        console.log(error);

        alert(
            error.response?.data?.message ||
            "Failed to update availability"
        );

    } finally {

        setUpdating(false);

    }
};

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading profile...</p>
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

            <div className="max-w-4xl mx-auto">

                <h1 className="text-3xl font-bold text-gray-800">
                    My Profile
                </h1>

                <p className="text-gray-500 mt-2">
                    View and manage your donor information.
                </p>


                <div className="bg-white rounded-xl shadow mt-8 p-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <p className="text-gray-500">
                                Name
                            </p>

                            <p className="font-semibold text-lg mt-1">
                                {profile?.name}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">
                                Email
                            </p>

                            <p className="font-semibold text-lg mt-1">
                                {profile?.email}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">
                                Phone
                            </p>

                            <p className="font-semibold text-lg mt-1">
                                {profile?.phone}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">
                                Blood Group
                            </p>

                            <p className="font-semibold text-lg text-red-600 mt-1">
                                {profile?.bloodGroup}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">
                                City
                            </p>

                            <p className="font-semibold text-lg mt-1">
                                {profile?.location?.city}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">
                                State
                            </p>

                            <p className="font-semibold text-lg mt-1">
                                {profile?.location?.state}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">
                                PIN
                            </p>

                            <p className="font-semibold text-lg mt-1">
                                {profile?.location?.pin}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">
                                Last Donation
                            </p>

                            <p className="font-semibold text-lg mt-1">

                                {profile?.lastDonation
                                    ? new Date(
                                        profile.lastDonation
                                    ).toLocaleDateString()
                                    : "No donation yet"}

                            </p>
                        </div>

                    </div>


                    {/* Availability */}

                    <div className="border-t mt-8 pt-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500">
                                    Donation Availability
                                </p>

                                <p className="font-semibold text-lg mt-1">

                                    {profile?.availability
                                        ? "Available to donate"
                                        : "Currently unavailable"}

                                </p>

                            </div>


                            <button
                                onClick={handleAvailability}
                                disabled={updating}
                                className={
                                    profile?.availability
                                        ? "bg-red-600 text-white px-5 py-3 rounded-lg"
                                        : "bg-green-600 text-white px-5 py-3 rounded-lg"
                                }
                            >

                                {updating
                                    ? "Updating..."
                                    : profile?.availability
                                        ? "Set Unavailable"
                                        : "Set Available"}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default DonorProfile;