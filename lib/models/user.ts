import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
	username: String,
	password: String,
	name: String,
	email: String,
	dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Users || mongoose.model("Users", userSchema);
