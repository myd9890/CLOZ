const express = require("express");
const router = express.Router();
const { generateBalanceSheet } = require("../controllers/balanceSheetController");

// Define the route for generating the balance sheet
router.get("/generate-balance-sheet", generateBalanceSheet);

module.exports = router;