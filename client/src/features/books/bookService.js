import axios from 'axios';

const API_URL = '/api/books/';

// Get all books
const getBooks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get book by id
const getBook = async (bookId) => {
  const response = await axios.get(API_URL + bookId);
  return response.data;
};

// Create new book
const createBook = async (bookData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.post(API_URL, bookData, config);
  return response.data;
};

// Update book
const updateBook = async (bookId, bookData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.put(API_URL + bookId, bookData, config);
  return response.data;
};

// Delete book
const deleteBook = async (bookId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.delete(API_URL + bookId, config);
  return response.data;
};

const bookService = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
};

export default bookService; 