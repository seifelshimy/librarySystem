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
});

// Populate user and book when retrieving borrow records
BorrowSchema.pre('find', function() {
  this.populate({
    path: 'user',
    select: 'name email'
  });
  this.populate({
    path: 'book',
    select: 'title author isbn genre subgenre coverImage availableCopies totalCopies'
  });
});

BorrowSchema.pre('findOne', function() {
  this.populate({
    path: 'user',
    select: 'name email'
  });
  this.populate({
    path: 'book',
    select: 'title author isbn genre subgenre coverImage availableCopies totalCopies'
  });
});

module.exports = mongoose.model('Borrow', BorrowSchema); 