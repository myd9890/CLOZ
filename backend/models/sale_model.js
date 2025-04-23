import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    priceAtSale: {
      type: Number,
      required: true,
      min: 0
    },
    returnedQuantity: {
      type: Number,
      default: 0,
      min: 0
    },
    returnReason: {
      type: String,
      default: ""
    },
    returnDate: {
      type: Date
    }
  }],
  paymentMethod: {
    type: String,
    required: true,
    enum: ["cash", "credit_card", "debit_card", "mobile_payment"]
  },
  status: {
    type: String,
    required: true,
    enum: ["completed", "pending", "cancelled", "returned", "partial_return"],
    default: "completed"
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    default: ""
  },
  returnNotes: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

/* // Update product stock after sale
saleSchema.post("save", async function(doc) {
  const Product = mongoose.model("Product");
  for (const item of doc.products) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }
});

// Revert product stock if sale is deleted
saleSchema.post("remove", async function(doc) {
  const Product = mongoose.model("Product");
  for (const item of doc.products) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    });
  }
}); */

const Sale= mongoose.model("Sale", saleSchema);
export default Sale;
