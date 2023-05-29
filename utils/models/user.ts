import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
	username: String,
	password: String,
	name: String,
	email: String,
	bsb: String,
	accountNumber: String,
	dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
