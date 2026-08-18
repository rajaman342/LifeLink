import { useAuth } from "../context/AuthContext";

function DashboardNavbar() {

    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">

            <h1 className="text-2xl font-bold text-red-600">
                LifeLink
            </h1>

            <div className="flex items-center gap-5">

                <span className="text-gray-700">
                    Hello, {user?.name}
                </span>

                <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default DashboardNavbar;