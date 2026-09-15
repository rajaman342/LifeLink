import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clearLoading, setClearLoading] = useState(false);


    // ==========================================
    // GET UNREAD COUNT
    // ==========================================

    const fetchUnreadCount = async () => {
        try {

            const response = await axiosInstance.get(
                "/notifications/unread-count"
            );

            setUnreadCount(
                response.data.count || 0
            );

        } catch (error) {

            console.log(
                "Unread count error:",
                error
            );
        }
    };


    // ==========================================
    // GET NOTIFICATIONS
    // ==========================================

    const fetchNotifications = async () => {
        try {

            setLoading(true);

            const response = await axiosInstance.get(
                "/notifications"
            );

            setNotifications(
                response.data.notifications || []
            );

        } catch (error) {

            console.log(
                "Notifications error:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        fetchUnreadCount();
        fetchNotifications();

    }, []);


    // ==========================================
    // MARK ONE AS READ
    // ==========================================

    const handleMarkAsRead = async (id) => {

        try {

            await axiosInstance.put(
                `/notifications/read/${id}`
            );


            setNotifications(
                previousNotifications =>
                    previousNotifications.map(
                        notification =>
                            notification._id === id
                                ? {
                                    ...notification,
                                    isRead: true
                                }
                                : notification
                    )
            );


            setUnreadCount(
                previousCount =>
                    Math.max(
                        0,
                        previousCount - 1
                    )
            );


        } catch (error) {

            console.log(
                "Mark as read error:",
                error
            );
        }
    };


    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    const handleMarkAllAsRead = async () => {

        try {

            await axiosInstance.put(
                "/notifications/read-all"
            );


            setNotifications(
                previousNotifications =>
                    previousNotifications.map(
                        notification => ({
                            ...notification,
                            isRead: true
                        })
                    )
            );


            setUnreadCount(0);


        } catch (error) {

            console.log(
                "Mark all as read error:",
                error
            );
        }
    };


    // ==========================================
    // CLEAR ALL NOTIFICATIONS
    // ==========================================

    const handleClearAll = async () => {

        // Ask for confirmation

        const confirmed = window.confirm(
            "Are you sure you want to clear all notifications?"
        );

        if (!confirmed) {
            return;
        }


        try {

            setClearLoading(true);


            await axiosInstance.delete(
                "/notifications/clear-all"
            );


            // Clear notifications from UI

            setNotifications([]);


            // Reset unread count

            setUnreadCount(0);


        } catch (error) {

            console.log(
                "Clear notifications error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to clear notifications"
            );

        } finally {

            setClearLoading(false);
        }
    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };


    return (

        <div className="relative">


            {/* ==================================
                NOTIFICATION BUTTON
            ================================== */}

            <button
                onClick={() => {

                    setShowNotifications(
                        previous =>
                            !previous
                    );


                    if (!showNotifications) {

                        fetchNotifications();
                        fetchUnreadCount();

                    }

                }}

                className="
                    relative
                    p-2
                    text-gray-700
                    hover:text-red-600
                    transition
                "
            >

                {/* Bell */}

                <span className="text-2xl">
                    🔔
                </span>


                {/* ==================================
                    UNREAD BADGE
                ================================== */}

                {unreadCount > 0 && (

                    <span
                        className="
                            absolute
                            -top-1
                            -right-1
                            bg-red-600
                            text-white
                            text-xs
                            font-bold
                            rounded-full
                            min-w-[20px]
                            h-5
                            px-1
                            flex
                            items-center
                            justify-center
                        "
                    >

                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}

                    </span>

                )}

            </button>


            {/* ==================================
                NOTIFICATION DROPDOWN
            ================================== */}

            {showNotifications && (

                <div
                    className="
                        absolute
                        right-0
                        mt-3
                        w-96
                        bg-white
                        rounded-xl
                        shadow-xl
                        border
                        z-50
                        overflow-hidden
                    "
                >


                    {/* ==================================
                        HEADER
                    ================================== */}

                    <div
                        className="
                            p-4
                            border-b
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        font-bold
                                        text-lg
                                    "
                                >
                                    Notifications
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                    "
                                >
                                    {unreadCount} unread
                                </p>

                            </div>


                            {/* CLOSE */}

                            <button
                                onClick={() =>
                                    setShowNotifications(false)
                                }

                                className="
                                    text-gray-400
                                    hover:text-gray-700
                                    text-xl
                                "
                            >
                                ×
                            </button>

                        </div>


                        {/* ==================================
                            ACTION BUTTONS
                        ================================== */}

                        {notifications.length > 0 && (

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    mt-4
                                    gap-3
                                "
                            >

                                {/* MARK ALL READ */}

                                {unreadCount > 0 ? (

                                    <button
                                        onClick={
                                            handleMarkAllAsRead
                                        }

                                        className="
                                            text-sm
                                            text-red-600
                                            hover:text-red-800
                                        "
                                    >
                                        Mark all as read
                                    </button>

                                ) : (

                                    <span
                                        className="
                                            text-sm
                                            text-gray-400
                                        "
                                    >
                                        All notifications read
                                    </span>

                                )}


                                {/* CLEAR ALL */}

                                <button
                                    onClick={handleClearAll}
                                    disabled={clearLoading}

                                    className="
                                        text-sm
                                        text-gray-600
                                        hover:text-red-600
                                        disabled:text-gray-400
                                    "
                                >

                                    {clearLoading
                                        ? "Clearing..."
                                        : "Clear all"}

                                </button>

                            </div>

                        )}

                    </div>


                    {/* ==================================
                        LOADING
                    ================================== */}

                    {loading && (

                        <div className="p-6 text-center">

                            <p className="text-gray-500">
                                Loading notifications...
                            </p>

                        </div>

                    )}


                    {/* ==================================
                        EMPTY
                    ================================== */}

                    {!loading &&
                        notifications.length === 0 && (

                            <div
                                className="
                                    p-8
                                    text-center
                                "
                            >

                                <div className="text-4xl">
                                    🔕
                                </div>

                                <p
                                    className="
                                        mt-3
                                        text-gray-500
                                    "
                                >
                                    No notifications
                                </p>

                            </div>

                        )}


                    {/* ==================================
                        NOTIFICATION LIST
                    ================================== */}

                    {!loading &&
                        notifications.length > 0 && (

                            <div
                                className="
                                    max-h-96
                                    overflow-y-auto
                                "
                            >

                                {notifications.map(
                                    notification => (

                                        <div
                                            key={
                                                notification._id
                                            }

                                            onClick={() =>
                                                !notification.isRead &&
                                                handleMarkAsRead(
                                                    notification._id
                                                )
                                            }

                                            className={`
                                                p-4
                                                border-b
                                                cursor-pointer
                                                hover:bg-gray-50
                                                transition
                                                ${
                                                    !notification.isRead
                                                        ? "bg-red-50"
                                                        : "bg-white"
                                                }
                                            `}
                                        >

                                            <div
                                                className="
                                                    flex
                                                    gap-3
                                                "
                                            >


                                                {/* ICON */}

                                                <div
                                                    className="
                                                        text-xl
                                                    "
                                                >

                                                    {
                                                        notification.type ===
                                                        "EMERGENCY_REQUEST"

                                                            ? "🚨"

                                                            : notification.type ===
                                                              "REQUEST_ACCEPTED"

                                                            ? "✅"

                                                            : notification.type ===
                                                              "REQUEST_REJECTED"

                                                            ? "❌"

                                                            : notification.type ===
                                                              "REQUEST_COMPLETED"

                                                            ? "🩸"

                                                            : "🔔"
                                                    }

                                                </div>


                                                {/* CONTENT */}

                                                <div
                                                    className="
                                                        flex-1
                                                    "
                                                >

                                                    <p
                                                        className={`
                                                            text-sm
                                                            ${
                                                                !notification.isRead
                                                                    ? "font-semibold text-gray-800"
                                                                    : "text-gray-600"
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            notification.message
                                                        }
                                                    </p>


                                                    {/* REQUEST INFO */}

                                                    {notification.emergencyRequest && (

                                                        <p
                                                            className="
                                                                text-xs
                                                                text-gray-500
                                                                mt-1
                                                            "
                                                        >

                                                            {
                                                                notification
                                                                    .emergencyRequest
                                                                    .bloodGroup
                                                            }

                                                            {" • "}

                                                            {
                                                                notification
                                                                    .emergencyRequest
                                                                    .hospitalName
                                                            }

                                                        </p>

                                                    )}


                                                    {/* DATE */}

                                                    <p
                                                        className="
                                                            text-xs
                                                            text-gray-400
                                                            mt-2
                                                        "
                                                    >

                                                        {formatDate(
                                                            notification.createdAt
                                                        )}

                                                    </p>

                                                </div>


                                                {/* UNREAD DOT */}

                                                {!notification.isRead && (

                                                    <div
                                                        className="
                                                            w-2
                                                            h-2
                                                            bg-red-600
                                                            rounded-full
                                                            mt-2
                                                        "
                                                    />

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </div>

            )}

        </div>
    );
}

export default NotificationBell;