const mongoose =require ('mongoose');

const productSchema = new mongoose.Schema({
  productId: { 
    type: String, 
    unique: true,
    required: true },

  name: { 
    type: String,  },

  description: { 
    type: String },

  category: {
     type: String, 
     required: true },

  brand: { 
    type: String },

  size: 
  { type: String  },

  color: { 
    type: [String],
     default: [] },

  material: {
    type: String },

  gender: { 
    type: String, 
    enum: ['Men', 'Women', 'Unisex'], 
    required: true },

  quantityInStock: { 
    type: Number, 
    required: true, 
    min: 0 },

  lowStockThreshold: { 
    type: Number, 
    default: 10 },

  reOrderLevel:{
    type:Number,
    default: 5},

  reOrderquantity:{
    type:Number,
    default:100
  },  
  supplier: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Supplier',
    required: true },

  price: { 
    type: Number, 
    required: true },

  supplierUnitPrice: { 
    type: Number, 
    required: true },

  discountPrice: { 
    type: Number, 
    default: 0 },

    taxPercentage:{
    type: Number,
    default: 0 
    },

  taxAmount:{
    type: Number,
    default: 0 
    },

    totalPrice:{
    type: Number,
    default: 0 
    }, 

  images: { 
    type: [String], 
    default: [] },

  status: { 
    type:String},

  addedDate: { 
    type: Date, 
    default: Date.now },

  updatedAt: { 
    type: Date,
    default: Date.now },

    discountStartDate: {
      type: Date
  },
  discountEndDate: {
      type: Date
  },
  status: {
      type: String,
      enum: ['Regular', 'On Sale', 'Out of Stock', 'Discontinued'],
      default: 'Regular'
  }
});

// Middleware to update `updatedAt` before saving
//productSchema.pre('save', function (next) {
  //this.updatedAt = Date.now();
  //next();
//});

const Product = mongoose.model('Product', productSchema);
module.exports=Product;
