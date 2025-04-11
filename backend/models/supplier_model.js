const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const supplierSchema = new mongoose.Schema({
  supplierId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  company: { type: String, required: true },
  brand: {type: String,required: true},
  status: { type: String, default: "Active" },
  password: { type: String, required: true }, // Password field
  createdAt: { type: Date, default: Date.now },
});

/* // Hash password before saving
supplierSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
supplierSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}; */

module.exports = mongoose.model('Supplier', supplierSchema);
