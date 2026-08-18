import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../services/axiosInstance";

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        name: "",
        email: "",
        password: "",
        phone: "",
        bloodGroup: "",
        city: "",
        state: "",
        pin: "",
        role: "donor"

    });

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setError("");
            setLoading(true);

            const response = await axiosInstance.post(
                "/auth/signup",
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,

                    bloodGroup: formData.bloodGroup,

                    location: {
                        city: formData.city,
                        state: formData.state,
                        pin: formData.pin
                    },

                    role: formData.role
                }
            );

            console.log(
                "Signup Response:",
                response.data
            );

            navigate("/login");

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Signup failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center text-red-600">
                    Create Account
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Join the LifeLink community
                </p>

                {error && (
                    <div className="mt-5 bg-red-100 text-red-600 p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />

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

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    >

                        <option value="donor">
                            Donor
                        </option>

                        <option value="patient">
                            Patient
                        </option>

                        <option value="hospital">
                            Hospital
                        </option>

                    </select>

                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="pin"
                        placeholder="PIN Code"
                        value={formData.pin}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"}

                    </button>

                </form>

                <p className="text-center mt-6 text-gray-600">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-red-600 font-semibold"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Signup;