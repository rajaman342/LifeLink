import { Link } from "react-router-dom";

function DonorSidebar() {

    return (
        <aside className="w-64 min-h-screen bg-gray-900 text-white p-6">

            <h2 className="text-xl font-bold mb-8">
                Donor Panel
            </h2>

            <div className="space-y-4">

                <Link
                    to="/donor-dashboard"
                    className="block px-4 py-3 rounded-lg hover:bg-gray-800"
                >
                    Dashboard
                </Link>

                <Link
                    to="/donor-profile"
                    className="block px-4 py-3 rounded-lg hover:bg-gray-800"
                >
                    My Profile
                </Link>

                <Link
                    to="/donor-requests"
                    className="block px-4 py-3 rounded-lg hover:bg-gray-800"
                >
                    Emergency Requests
                </Link>

                <Link
                    to="/donation-history"
                    className="block px-4 py-3 rounded-lg hover:bg-gray-800"
                >
                    Donation History
                </Link>

            </div>

        </aside>
    );
}

export default DonorSidebar;