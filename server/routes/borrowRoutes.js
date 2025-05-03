const express = require('express');
const {
  getBorrows,
  getBorrow,
  createBorrow,
  returnBook,
  deleteBorrow,
  createTestBorrow
} = require('../controllers/borrowController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.post('/', createBorrow);
router.get('/', getBorrows);
router.get('/:id', getBorrow);

// Admin/librarian routes
router.put('/:id', authorize('admin', 'librarian'), returnBook);
router.delete('/:id', authorize('admin'), deleteBorrow);

// Test route - admin only
router.post('/test/create', authorize('admin'), createTestBorrow);

module.exports = router; 