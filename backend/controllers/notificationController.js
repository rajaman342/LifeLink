const Notification = require("../models/Notification");


// ======================================================
// GET MY NOTIFICATIONS
// ======================================================

const getMyNotifications = async (req, res) => {
    try {

        const notifications = await Notification
            .find({
                recipient: req.user.id
            })
            .populate(
                "emergencyRequest",
                "bloodGroup unitsRequired hospitalName status"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            total: notifications.length,

            notifications
        });


    } catch (error) {

        console.log(
            "Get Notifications Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to get notifications"
        });
    }
};


// ======================================================
// GET UNREAD NOTIFICATION COUNT
// ======================================================

const getUnreadCount = async (req, res) => {
    try {

        const count =
            await Notification.countDocuments({

                recipient: req.user.id,

                isRead: false
            });


        return res.status(200).json({

            success: true,

            count
        });


    } catch (error) {

        console.log(
            "Unread Count Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to get unread count"
        });
    }
};


// ======================================================
// MARK ONE NOTIFICATION AS READ
// ======================================================

const markAsRead = async (req, res) => {
    try {

        const notification =
            await Notification.findOneAndUpdate(

                {
                    _id: req.params.id,

                    // IMPORTANT:
                    // User can only update
                    // his own notification
                    recipient: req.user.id
                },

                {
                    isRead: true
                },

                {
                    new: true
                }
            );


        if (!notification) {

            return res.status(404).json({

                success: false,

                message:
                    "Notification not found"
            });
        }


        return res.status(200).json({

            success: true,

            message:
                "Notification marked as read",

            notification
        });


    } catch (error) {

        console.log(
            "Mark Notification Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to mark notification as read"
        });
    }
};


// ======================================================
// MARK ALL NOTIFICATIONS AS READ
// ======================================================

const markAllAsRead = async (req, res) => {
    try {

        const result =
            await Notification.updateMany(

                {
                    recipient: req.user.id,

                    isRead: false
                },

                {
                    isRead: true
                }
            );


        return res.status(200).json({

            success: true,

            message:
                "All notifications marked as read",

            updated:
                result.modifiedCount
        });


    } catch (error) {

        console.log(
            "Mark All Notifications Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to mark all notifications as read"
        });
    }
};
// ==========================================
// DELETE ALL MY NOTIFICATIONS
// ==========================================

const deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({
            recipient: req.user.id,
        });

        return res.status(200).json({
            success: true,
            message: "All notifications cleared",
        });

    } catch (error) {
        console.log("Delete All Notifications Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to clear notifications",
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getMyNotifications,

    getUnreadCount,

    markAsRead,

    markAllAsRead,
    deleteAllNotifications
};