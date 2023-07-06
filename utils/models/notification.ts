import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema({
	creator: mongoose.Types.ObjectId, // User creating the notification
	recipients: [mongoose.Types.ObjectId], // Users receiving the notification
	type: String, // Type of notification
	// message: String, // Message to be displayed
	target: { type: mongoose.Types.ObjectId, default: null }, // ID of debt or settlement being referenced
	read: { type: Boolean, default: false }, // Whether the notification has been read
	dateCreated: { type: Date, default: Date.now }, // Date the notification was created
});

module.exports =
	mongoose.models.Notification ||
	mongoose.model("Notification", notificationSchema);
