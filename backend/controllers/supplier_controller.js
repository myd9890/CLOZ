const Supplier = require('../models/supplier_model'); 
const jwt = require('jsonwebtoken');

// Add new supplier
const addSupplier = async (req, res) => {
  try {
    const {
      supplierId,
      name,
      email,
      phone,
      address,
      company,
      brand,
      password, 
      status
    } = req.body;

    // Check if supplier with same email or ID already exists
    const existingSupplier = await Supplier.findOne({
      $or: [{ email: email }, { supplierId: supplierId }]
    });

    if (existingSupplier) {
      return res.status(400).json({ message: 'Supplier with ID already exists.' });
    }

    // Create new supplier
    const newSupplier = new Supplier({
      supplierId,
      name,
      email,
      phone,
      address,
      company,
      brand,
      password, 
      status
    });

    // Save to DB
    await newSupplier.save();

    res.status(201).json({ message: 'Supplier added successfully', supplier: newSupplier });
  } catch (error) {
    console.error('Error adding supplier:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getSuppliers = async (req, res) => {
  try {
      const suppliers = await Supplier.find();
      res.json(suppliers);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch suppliers", error: error.message });
  }
};

// Backend route to fetch a single supplier by objectid
const get= async (req, res) => {
  try {
    const supplier = await Supplier.findById({
       _id: req.params.supplierObjectId 
    });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json(supplier);
  } catch (error) {
    console.error("Error fetching supplier:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Backend route to fetch a single supplier by supplierId
const getSupplier= async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      supplierId: req.params.supplierId
    });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(supplier);
  } catch (error) {
    console.error("Error fetching supplier:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//update supplier
const updateSupplier= async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Supplier updated successfully!", supplier: updatedSupplier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete supplier
const deleteSupplier= async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Supplier deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* // Login supplier
const loginSupplier = async (req, res) => {
  const { supplierId, password } = req.body;

  try {
    const supplier = await Supplier.findOne({ supplierId });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const isMatch = await supplier.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: supplier._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, supplierId: supplier.supplierId });
  } catch (error) {
    console.error('Error logging in supplier:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout supplier
const logoutSupplier = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
}; */

module.exports = { addSupplier, getSuppliers, get, getSupplier, updateSupplier, deleteSupplier/* , loginSupplier, logoutSupplier */ };
