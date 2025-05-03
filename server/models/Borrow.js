const mongoose = require('mongoose');

const BorrowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  },
  fine: {
    type: Number,
    default: 0
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update status to 'overdue' if past due date and not yet returned
BorrowSchema.pre('find', { document: false, query: true }, async function(next) {
  try {
    // First, update any overdue borrows
    const now = new Date();
    await this.model.updateMany(
      { 
        status: 'borrowed', 
        dueDate: { $lt: now },
        returnDate: { $exists: false }
      },
      { 
        status: 'overdue' 
      }
    );
    next();
  } catch (error) {
    console.error('Error updating overdue borrows:', error);
    next(error);
  }
});

// Populate user and book when retrieving borrow records
BorrowSchema.pre('find', { document: false, query: true }, async function(next) {
  try {
    this.populate({
      path: 'user',
      select: 'name email'
    });
    this.populate({
      path: 'book',
      select: 'title author isbn genre subgenre coverImage availableCopies totalCopies'
    });
    next();
  } catch (error) {
    console.error('Error populating borrow fields:', error);
    next(error);
  }
});

BorrowSchema.pre('findOne', { document: false, query: true }, async function(next) {
  try {
    this.populate({
      path: 'user',
      select: 'name email'
    });
    this.populate({
      path: 'book',
      select: 'title author isbn genre subgenre coverImage availableCopies totalCopies'
    });
    next();
  } catch (error) {
    console.error('Error populating single borrow fields:', error);
    next(error);
  }
});

module.exports = mongoose.model('Borrow', BorrowSchema); 