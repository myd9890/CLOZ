const express = require("express");
const {
  createCustomer,
  //loginCustomer,
  //logoutCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerByPhone,
  getCustomerById,
} = require("../controllers/customerController");

const router = express.Router();

router.post("/register", createCustomer);

//router.post("/login", loginCustomer);

//router.post("/logout", logoutCustomer);

router.get("/read", getCustomers);

router.put("/update/:id", updateCustomer);

router.delete("/delete/:id", deleteCustomer);

router.get("/profile/:phone", getCustomerByPhone);

router.get("/:id", getCustomerById);

module.exports = router;
