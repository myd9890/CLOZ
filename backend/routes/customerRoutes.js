const express = require("express");
const {
  createCustomer,

  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerByPhone,
  getCustomerById,
  sendBroadcastEmail,
  loginCustomer,
  logoutCustomer,
} = require("../controllers/customerController");

const router = express.Router();

router.post("/register", createCustomer);

router.get("/read", getCustomers);

router.put("/update/:id", updateCustomer);

router.delete("/delete/:id", deleteCustomer);

router.get("/profile/:phone", getCustomerByPhone);

router.get("/:id", getCustomerById);
// Broadcast Email Route
router.post("/broadcast-email", sendBroadcastEmail);

router.post("/login", loginCustomer);
router.post("/logout", logoutCustomer);

module.exports = router;
