
const Order = require("../models/supplierOrder_model.js");
const Product = require("../models/product_model.js");
const Supplier = require("../models/supplier_model.js");

// Place Order (Automated from product controller)
const placeOrder = async (productId, supplierId, quantity,supplierUnitPrice) => {
    try {
        const newOrder = new Order({
            product: productId,
            supplier: supplierId,
            quantity,
            totalPrice: quantity * supplierUnitPrice,
        });

        const savedOrder = await newOrder.save();

        const populatedOrder = await Order.findById(savedOrder._id).populate('product');

        // Send socket notification to supplier
        global.io.emit("newOrder", {
            message: `New order placed for ${populatedOrder.product.name}.  ${populatedOrder.product.gender} ,
            ${populatedOrder.product.size},${populatedOrder.product.material},${populatedOrder.product.color},
            ${populatedOrder.product.reOrderquantity}`,
            order: savedOrder
        });

        console.log(`Order placed successfully: ${savedOrder._id}`);
        return { success: true, order: savedOrder };
    } catch (error) {
        console.error(`Order placement failed: ${error.message}`);
        return { success: false, error: error.message };
    }
};
//manual order
const placeManualOrder = async (req,res) => {
    try {
        const { productObjectId, supplierObjectId, quantity,totalPrice } = req.body;
        const newOrder = new Order({
            product: productObjectId,
            supplier: supplierObjectId,
            quantity:quantity,
            totalPrice:totalPrice,
            adminStatus:"Approved"
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({ message: 'Order placed successfully!' });
        return savedOrder;
    } catch (error) {
        console.error('Error placing order:', error);  // Log the error
        res.status(500).json({ error: 'Failed to place order' });

    }
};

// Fetch all orders
const getAllOrders = async (req, res) => {
    try {
        // Find all orders and populate product and supplier details
        const orders = await Order.find()
            .populate('product')
            .populate('supplier');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching all orders", error: error.message });
    }
};


// Get orders for supplier
const getOrdersForSupplier = async (req, res) => {
    try {
        const supplierCode = req.params.supplierId; // This is "SUP001"

        // First find supplier _id
        const supplier = await Supplier.findOne({ supplierId: supplierCode });
        if (!supplier) return res.status(404).json({ message: "Supplier not found" });

        // Then find orders
        const orders = await Order.find({ supplier: supplier._id }).populate('product');
        const acceptedOrders = orders.filter(order => order.adminStatus === "Approved");
        res.json(acceptedOrders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status} = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = status;
        

        await order.save();

        
        res.json({ message: `Order ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error: error.message });
    }
};

//admin update status 
const updateAdminStatus = async (req, res) => {
    try {
        const { adminStatus } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { adminStatus }, 
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Admin status updated successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin status', error: error.message });
    }}
module.exports = { placeOrder, getOrdersForSupplier, updateOrderStatus,getAllOrders,updateAdminStatus,placeManualOrder };
