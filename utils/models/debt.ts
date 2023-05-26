import mongoose from "mongoose";
const { Schema } = mongoose;

const debtSchema = new Schema({
	creditor: mongoose.Types.ObjectId,
	debtor: mongoose.Types.ObjectId,
	amount: Number,
	description: String,
	status: {
		type: String,
		enum: ["outstanding", "pending", "closed"],
		default: "outstanding",
	},
	dateCreated: { type: Date, default: Date.now },
	dateClosed: { type: Date, default: null },
});

module.exports = mongoose.models.Debt || mongoose.model("Debt", debtSchema);
