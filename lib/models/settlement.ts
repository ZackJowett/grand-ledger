import mongoose from "mongoose";
const { Schema } = mongoose;

// Settlement Schema
// A settlement is a closure of multiple debts by one party paying another party
// the difference between the total amount owed and the total amount owed to them
//
// When a settlement is created it is not closed. The other party must accept the settlement
// When a settlement is closed, the debts are closed and the settlement is closed
const settlementSchema = new Schema({
	settler: mongoose.Types.ObjectId,
	settlee: mongoose.Types.ObjectId,
	debts: [mongoose.Types.ObjectId],
	netAmount: mongoose.Types.Decimal128,
	closed: Boolean,
	dateCreated: { type: Date, default: Date.now },
});

module.exports =
	mongoose.models.Settlement ||
	mongoose.model("Settlement", settlementSchema);