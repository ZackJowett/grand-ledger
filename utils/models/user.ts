import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
	email: String,
	password: String,
	name: String,
	bsb: String,
	accountNumber: String,
	avatarURL: { type: String, default: null },
	dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
