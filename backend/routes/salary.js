const express = require('express');
const router = express.Router();
const { getSalaryRecords, getETFRecords } = require('../controllers/salaryController');

// API Salary Calc
router.get('/', getSalaryRecords);

// API ETF Calc
router.get('/etf', getETFRecords);

module.exports = router;