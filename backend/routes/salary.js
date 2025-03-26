const express = require('express');
const router = express.Router();
const { getSalaryRecords } = require('../controllers/salaryController');

// API Salary Calc
router.get('/', getSalaryRecords);

module.exports = router;