const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    trim: true
  },
  publicationYear: {
    type: Number,
    required: [true, 'Please add a publication year']
  },
  genre: {
    type: String,
    required: [true, 'Please add a genre'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  totalCopies: {
    type: Number,
    required: [true, 'Please add the total number of copies'],
    default: 1
  },
  availableCopies: {
    type: Number,
    required: [true, 'Please add the number of available copies'],
    default: function() {
      return this.totalCopies;
    }
  },
  coverImage: {
    type: String,
    default: 'no-image.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', BookSchema); 