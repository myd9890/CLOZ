const express = require("express");
const router = express.Router();
const { generatePLStatement } = require("../controllers/plController");

router.get("/", generatePLStatement); // Example: /plstatement?start=2025-01-01&end=2025-01-31

module.exports = router;
