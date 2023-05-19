import mongoose from "mongoose";
const { Schema } = mongoose;

const debtSchema = new Schema({
	creditor: mongoose.Types.ObjectId,
	debtor: mongoose.Types.ObjectId,
	amount: Number,
	description: String,
	closed: { type: Boolean, default: false },
	dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Debt || mongoose.model("Debt", debtSchema);
