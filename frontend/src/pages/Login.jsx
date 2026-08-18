import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

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
                "/auth/login",
                formData
            );

            console.log("Login Response:", response.data);

            const {
                token,
                user
            } = response.data;

            login(user, token);

         if (user.role === "donor") {

    navigate("/donor-dashboard");

} else if (user.role === "patient") {

    navigate("/patient-dashboard");

} else if (user.role === "hospital") {

    navigate("/hospital-dashboard");

} else if (user.role === "admin") {

    navigate("/admin-dashboard");

} else {

    navigate("/");

}

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center text-red-600">
                    Welcome Back
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Login to your LifeLink account
                </p>

                {error && (
                    <div className="mt-5 bg-red-100 text-red-600 p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >

                    {/* Email */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <div className="flex items-center border rounded-lg px-3">

                            <FaEnvelope className="text-gray-400" />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full p-3 outline-none"
                                required
                            />

                        </div>

                    </div>

                    {/* Password */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <div className="flex items-center border rounded-lg px-3">

                            <FaLock className="text-gray-400" />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full p-3 outline-none"
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="text-sm text-gray-500"
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>

                    {/* Login Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>

                <p className="text-center mt-6 text-gray-600">

                    Don't have an account?{" "}

                    <Link
                        to="/signup"
                        className="text-red-600 font-semibold"
                    >
                        Signup
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;