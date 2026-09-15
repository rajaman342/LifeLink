const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        // User who will receive the notification
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Notification message
        message: {
            type: String,
            required: true,
        },

        // Type of notification
        type: {
            type: String,
            enum: [
                "EMERGENCY_REQUEST",
                "REQUEST_ACCEPTED",
                "REQUEST_REJECTED",
                "REQUEST_COMPLETED",
                "REQUEST_EXPIRED",
            ],
            required: true,
        },

        // Related emergency request
        emergencyRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EmergencyRequest",
            default: null,
        },

        // Whether notification has been read
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);