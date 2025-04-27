const express = require("express");
const router = express.Router();
const { generateBalanceSheet } = require("../controllers/balanceSheetController");


router.get("/generate-balance-sheet", generateBalanceSheet);

module.exports = router;
