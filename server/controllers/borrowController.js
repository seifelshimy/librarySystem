const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const mongoose = require('mongoose');

// @desc    Get all borrows
// @route   GET /api/borrows
// @access  Private (Admin or Librarian)
exports.getBorrows = async (req, res) => {
  try {
    console.log('getBorrows controller called by user:', req.user.id, 'role:', req.user.role);
    
    let query;
    
    // If user is not admin, only show their borrows
    if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
      console.log('Getting borrows for regular user:', req.user.id);
      query = Borrow.find({ user: req.user.id });
    } else {
      console.log('Getting all borrows for admin/librarian');
      query = Borrow.find();
    }
    
    const borrows = await query;
    console.log(`Found ${borrows.length} borrows`);

    // Check for any borrows with missing references
    const borrowsWithMissingRefs = borrows.filter(
      borrow => !borrow.book || !borrow.user
    );
    
    if (borrowsWithMissingRefs.length > 0) {
      console.log(`Warning: ${borrowsWithMissingRefs.length} borrows have missing book or user references`);
    }

    res.status(200).json({
      success: true,
      count: borrows.length,
      data: borrows
    });
  } catch (error) {
    console.error('Error in getBorrows controller:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single borrow
// @route   GET /api/borrows/:id
// @access  Private
exports.getBorrow = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: `Borrow not found with id of ${req.params.id}`
      });
    }

    // Make sure user is borrow owner or admin/librarian
    if (
      borrow.user.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'librarian'
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to view this borrow`
      });
    }

    res.status(200).json({
      success: true,
      data: borrow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new borrow
// @route   POST /api/borrows
// @access  Private
exports.createBorrow = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.book) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a book ID'
      });
    }

    // Add user to req.body
    req.body.user = req.user.id;

    // Check if book exists
    const book = await Book.findById(req.body.book);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id of ${req.body.book}`
      });
    }

    // Check if book is available
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book not available for borrowing'
      });
    }

    // Check if user already has an active loan for this book
    const existingBorrow = await Borrow.findOne({
      user: req.user.id,
      book: req.body.book,
      status: { $ne: 'returned' }
    });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active loan for this book'
      });
    }

    // Calculate due date (default 14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    req.body.dueDate = dueDate;

    // Create borrow
    const borrow = await Borrow.create(req.body);

    // Update book available copies
    await Book.findByIdAndUpdate(req.body.book, {
      availableCopies: book.availableCopies - 1
    });

    // Get borrow with populated book and user
    const populatedBorrow = await Borrow.findById(borrow._id);

    res.status(201).json({
      success: true,
      data: populatedBorrow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update borrow (return book)
// @route   PUT /api/borrows/:id
// @access  Private
exports.returnBook = async (req, res) => {
  try {
    let borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: `Borrow not found with id of ${req.params.id}`
      });
    }

    // Make sure user is borrow owner or admin/librarian
    if (
      borrow.user.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'librarian'
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to return this book`
      });
    }

    // Check if book is already returned
    if (borrow.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book already returned'
      });
    }

    // Set return date and status
    borrow.returnDate = new Date();
    borrow.status = 'returned';

    // Calculate fine if book is returned late
    if (new Date() > borrow.dueDate) {
      const daysLate = Math.ceil(
        (new Date() - borrow.dueDate) / (1000 * 60 * 60 * 24)
      );
      borrow.fine = daysLate * 0.5; // $0.50 per day late
    }

    // Save borrow
    await borrow.save();

    // Update book available copies
    const book = await Book.findById(borrow.book);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    await Book.findByIdAndUpdate(borrow.book, {
      availableCopies: book.availableCopies + 1
    });
    
    res.status(200).json({
      success: true,
      data: borrow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete borrow
// @route   DELETE /api/borrows/:id
// @access  Private (Admin)
exports.deleteBorrow = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: `Borrow not found with id of ${req.params.id}`
      });
    }

    await borrow.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Test endpoint to create sample borrows
// @route   POST /api/borrows/test
// @access  Private (Admin)
exports.createTestBorrow = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can use this test endpoint'
      });
    }

    // Find a book
    const book = await Book.findOne();
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'No books found to create test borrow'
      });
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Create a test borrow
    const borrow = await Borrow.create({
      user: req.user.id,
      book: book._id,
      borrowDate: new Date(),
      dueDate: dueDate,
      status: 'borrowed'
    });

    // Update book available copies
    await Book.findByIdAndUpdate(book._id, {
      availableCopies: Math.max(0, book.availableCopies - 1)
    });

    // Get fully populated borrow
    const populatedBorrow = await Borrow.findById(borrow._id);

    res.status(201).json({
      success: true,
      message: 'Test borrow created successfully',
      data: populatedBorrow
    });
  } catch (error) {
    console.error('Error creating test borrow:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 