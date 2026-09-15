const express = require("express");

const auth = require("../middleware/authMiddleware");

const {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteAllNotifications
} = require("../controllers/notificationController");

const router = express.Router();


// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

router.get(
    "/",
    auth,
    getMyNotifications
);


// ==========================================
// GET UNREAD COUNT
// ==========================================

router.get(
    "/unread-count",
    auth,
    getUnreadCount
);


// ==========================================
// MARK ONE AS READ
// ==========================================

router.put(
    "/:id/read",
    auth,
    markAsRead
);
router.delete(
    "/clear-all",
    auth,
    deleteAllNotifications
);


// ==========================================
// MARK ALL AS READ
// ==========================================

router.put(
    "/read-all",
    auth,
    markAllAsRead
);


module.exports = router;