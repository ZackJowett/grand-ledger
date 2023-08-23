import mongoose from "mongoose";
const { Schema } = mongoose;

const groupSchema = new Schema({
	code: { type: String, unique: true },
	name: String,
	members: [mongoose.Types.ObjectId],
	admins: [mongoose.Types.ObjectId],
	creator: mongoose.Types.ObjectId,
	dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Group || mongoose.model("Group", groupSchema);
