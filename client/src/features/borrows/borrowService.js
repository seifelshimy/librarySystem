import axios from 'axios';

const API_URL = '/api/borrows/';

// Get user borrows
const getBorrows = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get borrow by id
const getBorrow = async (borrowId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(API_URL + borrowId, config);
  return response.data;
};

// Create new borrow
const createBorrow = async (borrowData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.post(API_URL, borrowData, config);
  return response.data;
};

// Return book
const returnBook = async (borrowId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.put(API_URL + borrowId, {}, config);
  return response.data;
};

const borrowService = {
  getBorrows,
  getBorrow,
  createBorrow,
  returnBook
};

export default borrowService; 