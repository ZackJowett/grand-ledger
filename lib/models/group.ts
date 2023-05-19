import mongoose from "mongoose";
const { Schema } = mongoose;

const groupSchema = new Schema({
	code: Number,
	members: [mongoose.Types.ObjectId],
	dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Group || mongoose.model("Group", groupSchema);
