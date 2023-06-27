import mongoose from "mongoose";
const { Schema } = mongoose;

const debtSchema = new Schema({
	// id: { type: Number, unique: true },
	creditor: mongoose.Types.ObjectId,
	debtor: mongoose.Types.ObjectId,
	creator: mongoose.Types.ObjectId,
	amount: Number,
	description: String,
	status: {
		type: String,
		enum: ["outstanding", "pending", "closed"],
		default: "outstanding",
	},
	settlement: { type: mongoose.Types.ObjectId, default: null },
	dateCreated: { type: Date, default: Date.now },
	dateClosed: { type: Date, default: null },
});

module.exports = mongoose.models.Debt || mongoose.model("Debt", debtSchema);
