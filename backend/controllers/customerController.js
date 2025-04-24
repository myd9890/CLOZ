import Customer from "../models/customer.js";
import express from "express";
//import axios from "axios";

const router = express.Router();

// Create a new customer profile
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const existingCustomerByEmail = await Customer.findOne({ email });
    if (existingCustomerByEmail) {
      return res
        .status(400)
        .json({ message: "Customer with this email already exists!" });
    }

    const existingCustomerByPhone = await Customer.findOne({ phone });
    if (existingCustomerByPhone) {
      return res
        .status(400)
        .json({ message: "Customer with this phone number already exists!" });
    }

    // Create and save the new customer
    const newCustomer = new Customer({ name, email, phone });
    await newCustomer.save();

    res.status(201).json({
      message: "Customer profile created successfully!",
      customer: newCustomer,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update (Edit) a customer profile
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found!" });
    }

    res.status(200).json({
      message: "Customer updated successfully!",
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a customer profile
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found!" });
    }

    res.status(200).json({ message: "Customer deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCustomerByPhone = async (req, res) => {
  try {
    let phone = req.params.phone;
    const customer = await Customer.findOne({ phone: phone });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    console.log(customer);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found!" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export default router;
