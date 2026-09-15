import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

function Navbar() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        logout();

        navigate("/login");
    };


    return (

        <nav className="bg-white shadow-md">

            <div className="max-w-7xl mx-auto px-6 py-4">

                <div className="flex items-center justify-between">


                    {/* ==================================
                        LOGO
                    ================================== */}

                    <Link
                        to="/"
                        className="text-2xl font-bold text-red-600"
                    >
                        LifeLink ❤️
                    </Link>


                    {/* ==================================
                        DESKTOP NAVIGATION
                    ================================== */}

                    <div className="hidden md:flex items-center gap-6">


                        {/* ==================================
                            GUEST USER
                        ================================== */}

                        {!user && (

                            <>
                                <Link to="/">
                                    Home
                                </Link>

                                <Link to="/login">
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="
                                        bg-red-600
                                        text-white
                                        px-5
                                        py-2
                                        rounded-lg
                                    "
                                >
                                    Signup
                                </Link>
                            </>

                        )}


                        {/* ==================================
                            PATIENT
                        ================================== */}

                        {user?.role === "patient" && (

                            <>
                                <Link to="/patient-dashboard">
                                    Dashboard
                                </Link>

                                <Link to="/create-emergency">
                                    Create Request
                                </Link>
                            </>

                        )}


                        {/* ==================================
                            DONOR
                        ================================== */}

                        {user?.role === "donor" && (

                            <>
                                <Link to="/donor-dashboard">
                                    Dashboard
                                </Link>

                                <Link to="/donor-requests">
                                    Requests
                                </Link>

                                <Link to="/history">
                                    History
                                </Link>
                            </>

                        )}


                        {/* ==================================
                            HOSPITAL
                        ================================== */}

                        {user?.role === "hospital" && (

                            <Link to="/hospital-dashboard">
                                Dashboard
                            </Link>

                        )}


                        {/* ==================================
                            ADMIN
                        ================================== */}

                        {user?.role === "admin" && (

                            <Link to="/admin-dashboard">
                                Dashboard
                            </Link>

                        )}


                        {/* ==================================
                            NOTIFICATION BELL
                        ================================== */}

                        {user && (

                            <NotificationBell />

                        )}


                        {/* ==================================
                            LOGOUT
                        ================================== */}

                        {user && (

                            <button
                                onClick={handleLogout}
                                className="
                                    bg-gray-800
                                    text-white
                                    px-5
                                    py-2
                                    rounded-lg
                                    hover:bg-gray-900
                                "
                            >
                                Logout
                            </button>

                        )}

                    </div>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;