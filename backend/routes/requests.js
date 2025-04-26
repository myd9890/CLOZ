const express = require('express');
const router = express.Router();
const {
  getAllRequests,
  applyRequest,
  updateRequestStatus,
} = require('../controllers/requestController');

// Get all Requests
router.get('/', getAllRequests);

// Add a Request
router.post('/', applyRequest);

// Update a Request
router.put('/:id', updateRequestStatus);

module.exports = router;