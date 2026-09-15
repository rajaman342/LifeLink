import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function CreateEmergencyRequest() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        bloodGroup: "",
        unitsRequired: 1,
        hospitalName: "",
        hospitalAddress: "",
        contactNumber: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ==========================================
    // CREATE REQUEST
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            // ==========================================
            // STEP 1: CREATE EMERGENCY REQUEST
            // ==========================================

            const response = await axiosInstance.post(
                "/emergency/create",
                formData
            );

            console.log(
                "Create Request Response:",
                response.data
            );

            // ==========================================
            // STEP 2: GET AI RECOMMENDED DONORS
            // ==========================================

            const recommendResponse =
                await axiosInstance.post(
                    "/emergency/recommend",
                    {
                        bloodGroup: formData.bloodGroup,
                    }
                );

            console.log(
                "AI Recommendation Response:",
                recommendResponse.data
            );

            // ==========================================
            // STEP 3: GET CREATED REQUEST
            // ==========================================

            const newRequest =
                response.data.request ||
                response.data;

            // ==========================================
            // STEP 4: GO TO PATIENT DASHBOARD
            // ==========================================

            navigate("/patient-dashboard", {
                state: {
                    newRequest: newRequest,

                    recommendedDonors:
                        recommendResponse.data.donors || [],
                },
            });

        } catch (error) {
            console.error(
                "Create Emergency Request Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create emergency request"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-2xl mx-auto">

                {/* ==========================================
                    FORM CARD
                ========================================== */}

                <div className="bg-white rounded-2xl shadow-lg p-8">

                    <h1 className="text-3xl font-bold text-red-600">
                        Emergency Blood Request
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Create a request for urgent blood requirements.
                    </p>

                    {/* ERROR */}

                    {error && (
                        <div className="mt-5 bg-red-100 text-red-600 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* ==========================================
                        FORM
                    ========================================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                    >

                        {/* BLOOD GROUP */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Blood Group
                            </label>

                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            >

                                <option value="">
                                    Select Blood Group
                                </option>

                                <option value="A+">A+</option>
                                <option value="A-">A-</option>

                                <option value="B+">B+</option>
                                <option value="B-">B-</option>

                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>

                                <option value="O+">O+</option>
                                <option value="O-">O-</option>

                            </select>

                        </div>

                        {/* UNITS */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Units Required
                            </label>

                            <input
                                type="number"
                                name="unitsRequired"
                                min="1"
                                max="20"
                                value={formData.unitsRequired}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            />

                        </div>

                        {/* HOSPITAL NAME */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Hospital Name
                            </label>

                            <input
                                type="text"
                                name="hospitalName"
                                value={formData.hospitalName}
                                onChange={handleChange}
                                placeholder="Enter hospital name"
                                className="w-full border p-3 rounded-lg"
                                required
                            />

                        </div>

                        {/* HOSPITAL ADDRESS */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Hospital Address
                            </label>

                            <textarea
                                name="hospitalAddress"
                                value={formData.hospitalAddress}
                                onChange={handleChange}
                                placeholder="Enter hospital address"
                                rows="3"
                                className="w-full border p-3 rounded-lg"
                                required
                            />

                        </div>

                        {/* CONTACT */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Contact Number
                            </label>

                            <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="Enter contact number"
                                className="w-full border p-3 rounded-lg"
                                required
                            />

                        </div>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
                        >

                            {loading
                                ? "Creating Request & Finding Donors..."
                                : "Create Emergency Request"}

                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default CreateEmergencyRequest;