const mongoose = require('mongoose'); 
const Product = require("../models/product_model.js");
const Supplier = require("../models/supplier_model.js");
const {placeOrder}=require("./supplierOrder_controller.js");



// Add a new product
const addProduct = async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const { 
            productId,
            name, 
            description, 
            category, 
            brand,
            size,
            color,
            material,
            gender,
            quantityInStock,
            supplier,
            price,
            discountPrice,
            supplierUnitPrice,
            taxPercentage ,
            taxAmount,
            totalPrice,
            images,
        } = req.body;

        
        if (!mongoose.Types.ObjectId.isValid(supplier)) {
            return res.status(400).json({ message: 'Invalid supplier ID' });
          }

          const supplierExists = await Supplier.findById(supplier);
          if (!supplierExists) {
              return res.status(404).json({ message: 'Supplier not found' });
          }

        const newProduct = new Product({
            productId,
            name,
            description,
            category,
            brand,
            size,
            color,
            material,
            gender,
            quantityInStock,
            supplier,
            price,
            supplierUnitPrice,
            discountPrice,
            taxPercentage ,
            taxAmount,
            totalPrice,
            images,
        });
        
        await newProduct.save();
        res.json({ message: "Product Added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add product", details: error.message });
    }
};

// Get all products with optional filters
const getProducts = async (req, res) => {
    try {
        const { name, category, brand, minPrice, maxPrice, size } = req.query;

        let filters = {};

        if (name) {
            filters.name = { $regex: name, $options: "i" };
        }

        if (category) {
            filters.category = category;
        }

        if (brand) {
            filters.brand = brand;
        }

        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = parseFloat(minPrice); 
            if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
        }

        if (size) {
            filters.size = size;
        }

        const products = await Product.find(filters).populate("supplier");
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

// Update a product by productId
const updateProduct = async (req, res) => {
    try {
        let productId = req.params.productId;
        const { 
            name, 
            description, 
            category, 
            brand,
            size,
            color,
            material,
            gender,
            quantityInStock,
            supplier,
            price,
            discountPrice,
            supplierUnitPrice,
            taxPercentage ,
            taxAmount,
            totalPrice,
            images,
        } = req.body;

        const updateProduct = {
            name,
            description,
            category,
            brand,
            size,
            color,
            material,
            gender,
            quantityInStock,
            supplier,
            price,
            discountPrice,
            supplierUnitPrice,
            taxPercentage ,
            taxAmount,
            totalPrice,
            images,
        };

        const update = await Product.findOneAndUpdate({ productId: productId }, updateProduct, { new: true });
        if (update.quantityInStock <= update.lowStockThreshold) {
            global.io.emit("lowStockNotification", {
                message: `Low stock alert for product ${update.name} (ID: ${update.productId}). Current stock: ${update.quantityInStock}.`,
                product: update,
            });    
        }

        if (update.quantityInStock <= update.reOrderLevel) {
            
            await placeOrder(update._id, update.supplier, update.reOrderquantity,update.supplierUnitPrice);

        }
        res.json({ status: "product updated", product: update });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error on updating the product" });
    }
};

// Delete a product by productId
const deleteProduct = async (req, res) => {
    try {
        let productId = req.params.productId;

        await Product.findOneAndDelete({ productId: productId });

        res.json({ status: "Product deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting the product" });
    }
};

// Get a single product by productId
const getProductById = async (req, res) => {
    try {
        let productId = req.params.productId;

        const product = await Product.findOne({ productId: productId });

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching the product" });
    }
};

module.exports = {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getProductById,
};