
import Sale from "../models/sale_model.js";
import Product from "../models/product_model.js";
import Customer from "../models/customer.js";
import { placeOrder } from "./supplierOrder_controller.js";


// Create new sale
export const createSale = async (req, res) => {
  try {
    const { products, customer, pointsToRedeem, ...saleData } = req.body;

    // Verify products and check stock
    const productUpdates = [];
    const saleProducts = [];
    let subtotal = 0;

    // Validate products array
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "Products array is required" });
    }

    // Check if customer is provided
    let customerData = null;
    if (customer) {
      // Verify customer exists if provided
      customerData = await Customer.findById(customer);
      if (!customerData) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Validate points redemption
      if (pointsToRedeem > customerData.loyaltyPoints) {
        return res
          .status(400)
          .json({ message: "Not enough loyalty points available" });
      }
    }

    // Process products
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.product} not found` });
      }
      if (product.quantityInStock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name} (Available: ${product.quantityInStock})`,
        });
      }

      const itemTotal = item.priceAtSale * item.quantity;
      subtotal += itemTotal;

      saleProducts.push({
        product: product._id,
        quantity: item.quantity,
        priceAtSale: item.priceAtSale,
      });

      productUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { quantityInStock: -item.quantity } },
        },
      });
    }

    // Calculate total with discount, points redemption, and tax
    const discount = saleData.discount || 0;
    const tax = saleData.tax || 0;
    const pointsDiscount = pointsToRedeem * 0.1;
    const totalAmount = subtotal - discount - pointsDiscount + subtotal * (tax / 100);

    // Create sale
    const sale = new Sale({
      ...saleData,
      products: saleProducts,
      totalAmount,
      pointsRedeemed: pointsToRedeem || 0,
      ...(customer && { customer }),
    });

    // Update product stocks
    if (productUpdates.length > 0) {
      await Product.bulkWrite(productUpdates);
    }

    // Check for low stock and emit notifications manually
    for (const item of products) {
      const updatedProduct = await Product.findById(item.product);

      if (updatedProduct.quantityInStock <= updatedProduct.lowStockThreshold) {
        global.io.emit("lowStockNotification", {
          message: `Low stock alert for product ${updatedProduct.name} (ID: ${updatedProduct.productId}). Current stock: ${updatedProduct.quantityInStock}.`,
          product: updatedProduct,
        });
      }

      if (updatedProduct.quantityInStock <= updatedProduct.reOrderLevel) {
        await placeOrder(
          updatedProduct._id,
          updatedProduct.supplier,
          updatedProduct.reOrderquantity,
          updatedProduct.supplierUnitPrice
        );
      }
    }

    await sale.save();

    // Handle customer loyalty points if customer exists
    if (customerData) {
      const amountPaid = totalAmount + pointsDiscount;
      const pointsEarned = pointsToRedeem > 0 ? 0 : Math.floor(amountPaid / 10);
      const finalPoints = pointsEarned - pointsToRedeem;

      await Customer.findByIdAndUpdate(customer, {
        $push: {
          purchaseHistory: {
            saleId: sale._id,
            date: sale.createdAt,
            amount: totalAmount,
            items: saleProducts.map((item) => ({
              product: item.product,
              quantity: item.quantity,
            })),
            pointsEarned: pointsEarned,
            pointsRedeemed: pointsToRedeem || 0,
          },
        },
        $inc: {
          totalPurchases: totalAmount,
          loyaltyPoints: finalPoints,
        },
      });
    }

    // Populate fields for response
    const populatedSale = await Sale.findById(sale._id)
      .populate("customer", "name phone")
      .populate("products.product", "name price");

    const response = {
      ...populatedSale.toObject(),
      ...(customerData && {
        pointsEarned:
          pointsToRedeem > 0
            ? 0
            : Math.floor((totalAmount + pointsDiscount) / 10),
        pointsRedeemed: pointsToRedeem || 0,
      }),
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update sale
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { products, ...updateData } = req.body;

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // Handle product updates if products array is provided
    if (products) {
      // First revert old product quantities
      const revertUpdates = sale.products.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { stock: item.quantity } },
        },
      }));

      await Product.bulkWrite(revertUpdates);

      // Then process new quantities
      const productUpdates = [];
      const saleProducts = [];
      let subtotal = 0;

      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res
            .status(404)
            .json({ message: `Product ${item.product} not found` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name} (Available: ${product.stock})`,
          });
        }

        const itemTotal = item.priceAtSale * item.quantity;
        subtotal += itemTotal;

        saleProducts.push({
          product: product._id,
          quantity: item.quantity,
          priceAtSale: item.priceAtSale,
        });

        productUpdates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $inc: { stock: -item.quantity } },
          },
        });
      }

      updateData.products = saleProducts;
      updateData.totalAmount =
        subtotal -
        (updateData.discount || 0) +
        subtotal * ((updateData.tax || 0) / 100);

      await Product.bulkWrite(productUpdates);
    }

    const updatedSale = await Sale.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("customer", "name phone")
      .populate("products.product", "name price");

    res.json(updatedSale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single sale
export const getSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id)
      .populate("customer", "name phone email")
      .populate("products.product", "name price");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all sales
export const getSales = async (req, res) => {
  try {
    const { customerId } = req.query;
    const query = customerId ? { customer: customerId } : {};

    const sales = await Sale.find(query)
      .populate("customer", "name phone")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete sale
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByIdAndDelete(id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // Product stock will be reverted automatically by the post-remove hook
    res.json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const initiateReturn = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("products.product")
      .populate("customer");
    if (!sale) {
      return res.status(404).send("Sale not found");
    }
    res.json(sale);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Process return
export const processReturn = async (req, res) => {
  try {
    const { returnedItems } = req.body; // Array of {productId, quantity, reason}
    console.log("Returned items:", returnedItems);
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    // Update product quantities
    for (const item of returnedItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.quantityInStock += item.quantity;
        await product.save();
      }

      // Update sale items - mark as returned
      const saleItem = sale.products.find(
        (p) => p.product.toString() === item.productId
      );
      if (saleItem) {
        saleItem.returnedQuantity =
          (saleItem.returnedQuantity || 0) + item.quantity;
        saleItem.returnReason = item.reason;
      }
    }

    // Check if all items are returned
    const allReturned = sale.products.every(
      (p) => p.quantity === (p.returnedQuantity || 0)
    );
    sale.status = allReturned ? "returned" : "partial_return";

    await sale.save();
    res.json({ message: "Return processed successfully", sale });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
