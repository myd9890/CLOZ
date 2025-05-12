
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    adminStatus:{type: String,  default: 'Pending'},
    createdAt: {
        type: Date,
        default: Date.now,  
        expires: 90 * 24 * 60 * 60,     
      },
});

module.exports = mongoose.model('Order', orderSchema);
