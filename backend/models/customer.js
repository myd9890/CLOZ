const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  registrationDate: { type: Date, default: Date.now },
  loyaltyPoints: { type: Number, default: 0 },
  purchaseHistory: [
    {
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    items: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      priceAtPurchase: {
        type: Number,
        required: true
      },
      pointsEarned: {
        type: Number,
      },
    }],
    paymentMethod: {
      type: String,
      enum: ["cash", "credit", "debit", "bank_transfer", "other"],
      required: true
    },
    status: {
      type: String,
      enum: ["completed", "returned", "partially_returned"],
      default: "completed"
    }
  }
  ],
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
