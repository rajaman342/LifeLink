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
        contactNumber: ""

    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            setError("");

            setSuccess("");

            const response = await axiosInstance.post(
                "/emergency/create",
                formData
            );

            console.log(response.data);

            setSuccess(
                "Emergency request created successfully!"
            );

            setFormData({

                bloodGroup: "",
                unitsRequired: 1,
                hospitalName: "",
                hospitalAddress: "",
                contactNumber: ""

            });

        } catch (error) {

            console.log(error);

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

                <div className="bg-white rounded-2xl shadow-lg p-8">

                    <h1 className="text-3xl font-bold text-red-600">

                        Emergency Blood Request

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Create a request for urgent blood requirements.

                    </p>


                    {error && (

                        <div className="mt-5 bg-red-100 text-red-600 p-3 rounded-lg">

                            {error}

                        </div>

                    )}


                    {success && (

                        <div className="mt-5 bg-green-100 text-green-600 p-3 rounded-lg">

                            {success}

                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                    >

                        {/* Blood Group */}

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


                        {/* Units */}

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


                        {/* Hospital Name */}

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


                        {/* Hospital Address */}

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


                        {/* Contact */}

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


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
                        >

                            {loading
                                ? "Creating Request..."
                                : "Create Emergency Request"}

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default CreateEmergencyRequest;