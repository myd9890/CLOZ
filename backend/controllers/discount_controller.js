const Product = require("../models/product_model.js");

// Apply discount to a single product
const applyDiscountToProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { discountPercentage, discountPrice, startDate, endDate } = req.body;

        // Validate input
        if ((!discountPercentage && !discountPrice) || 
            (discountPercentage && discountPrice)) {
            return res.status(400).json({ 
                error: "Provide either discountPercentage or discountPrice, not both" 
            });
        }

        const product = await Product.findOne({ productId });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Calculate discount price if percentage is provided
        if (discountPercentage) {
            product.discountPrice = product.price * ( discountPercentage / 100);
        } else {
            product.discountPrice = discountPrice;
        }

        // Set discount period if provided
        if (startDate) product.discountStartDate = new Date(startDate);
        if (endDate) product.discountEndDate = new Date(endDate);

        // Update product status if needed
        product.status = product.discountPrice < product.price ? "On Sale" : "Regular";

        await product.save();
        res.json({ 
            message: "Discount applied successfully",
            product 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to apply discount", details: error.message });
    }
};

// Apply discount to multiple products by filter
const applyBulkDiscount = async (req, res) => {
    try {
        const { 
            category, 
            brand, 
            discountPercentage, 
            discountPrice,
            startDate,
            endDate 
        } = req.body;

        // Validate input
        if ((!discountPercentage && !discountPrice) || 
            (discountPercentage && discountPrice)) {
            return res.status(400).json({ 
                error: "Provide either discountPercentage or discountPrice, not both" 
            });
        }

        if (!category && !brand) {
            return res.status(400).json({ 
                error: "Provide at least one filter (category or brand)" 
            });
        }

        // Build filter
        const filter = {};
        if (category) filter.category = category;
        if (brand) filter.brand = brand;

        const products = await Product.find(filter);

        // Apply discount to each product
        const updatePromises = products.map(async (product) => {
            if (discountPercentage) {
                product.discountPrice = product.price * (1 - discountPercentage / 100);
            } else {
                product.discountPrice = discountPrice;
            }

            // Set discount period if provided
            if (startDate) product.discountStartDate = new Date(startDate);
            if (endDate) product.discountEndDate = new Date(endDate);

            // Update product status if needed
            product.status = product.discountPrice < product.price ? "On Sale" : "Regular";

            return product.save();
        });

        await Promise.all(updatePromises);
        res.json({ 
            message: `Discount applied to ${products.length} products successfully`,
            count: products.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to apply bulk discount", details: error.message });
    }
};

// Remove discount from a product
const removeDiscount = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findOne({ productId });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        product.discountPrice = 0;
        product.discountStartDate = undefined;
        product.discountEndDate = undefined;
        product.status = "Regular";

        await product.save();
        res.json({ 
            message: "Discount removed successfully",
            product 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to remove discount", details: error.message });
    }
};

// Get all discounted products
const getDiscountedProducts = async (req, res) => {
    try {
        const products = await Product.find({ 
            discountPrice: { $gt: 0 },
            $or: [
                { discountEndDate: { $exists: false } },
                { discountEndDate: { $gte: new Date() } }
            ]
        }).populate("supplier");

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch discounted products" });
    }
};

module.exports = {
    applyDiscountToProduct,
    applyBulkDiscount,
    removeDiscount,
    getDiscountedProducts
};