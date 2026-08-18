import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Unauthorized from "./pages/Unauthorized";


// Patient Pages
import PatientDashboard from "./pages/PatientDashboard";
import CreateEmergencyRequest from "./pages/CreateEmergencyRequest";


// Donor Pages
import DonorDashboard from "./pages/DonorDashboard";
import DonorRequests from "./pages/DonorRequests";
import DonorProfile from "./pages/DonorProfile";
import DonationHistory from "./pages/DonationHistory";


// Hospital Pages
import HospitalDashboard from "./pages/HospitalDashboard";


// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";


// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";


function App() {

    return (
           
        <BrowserRouter>
        <Navbar/>
        

            <Routes>


                {/* ==================== */}
                {/* PUBLIC ROUTES */}
                {/* ==================== */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                />


                {/* ==================== */}
                {/* DONOR ROUTES */}
                {/* ==================== */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["donor"]}
                        />
                    }
                >

                    <Route
                        path="/donor-dashboard"
                        element={<DonorDashboard />}
                    />

                    <Route
                        path="/donor-requests"
                        element={<DonorRequests />}
                    />

                    <Route
                        path="/donor-profile"
                        element={<DonorProfile />}
                    />

                    <Route
                        path="/donation-history"
                        element={<DonationHistory />}
                    />

                </Route>


                {/* ==================== */}
                {/* PATIENT ROUTES */}
                {/* ==================== */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["patient"]}
                        />
                    }
                >

                    <Route
                        path="/patient-dashboard"
                        element={<PatientDashboard />}
                    />

                    <Route
                        path="/create-emergency"
                        element={<CreateEmergencyRequest />}
                    />

                </Route>


                {/* ==================== */}
                {/* HOSPITAL ROUTES */}
                {/* ==================== */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["hospital"]}
                        />
                    }
                >

                    <Route
                        path="/hospital-dashboard"
                        element={<HospitalDashboard />}
                    />

                </Route>


                {/* ==================== */}
                {/* ADMIN ROUTES */}
                {/* ==================== */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin"]}
                        />
                    }
                >

                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />

                </Route>


            </Routes>
            
        </BrowserRouter>

    );
}


export default App;