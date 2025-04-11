const router = require("express").Router();
const productController = require("../controllers/product_controller");


// Add a new product
router.post("/add", productController.addProduct);

// Get all products with optional filters
router.get("/", productController.getProducts);

// Update a product by productId
router.put("/update/:productId", productController.updateProduct);

// Delete a product by productId
router.delete("/delete/:productId", productController.deleteProduct);

// Get a single product by productId
router.get("/:productId", productController.getProductById);

module.exports = router;