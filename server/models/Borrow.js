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

// Calculate fine when retrieving a borrow record
BorrowSchema.pre('find', function() {
  this.populate('user', 'name email');
  this.populate('book', 'title author isbn coverImage');
});

BorrowSchema.pre('findOne', function() {
  this.populate('user', 'name email');
  this.populate('book', 'title author isbn coverImage');
});

module.exports = mongoose.model('Borrow', BorrowSchema); 