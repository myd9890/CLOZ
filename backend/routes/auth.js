const express = require('express');
const { auth } = require('../middleware/auth');
const {
  registerEmployee,
  loginEmployee,
  changePassword,
} = require('../controllers/authController');
const router = express.Router();

// Register a new employee
router.post('/register', registerEmployee);

// Login an employee
router.post('/login', loginEmployee);

// Change password
router.post('/change-password', auth, changePassword);

module.exports = router;