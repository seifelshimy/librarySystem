import axios from 'axios';

const API_URL = '/api/borrows/';

// Get user borrows
const getBorrows = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.get(API_URL, config);
    
    // Ensure we have valid borrow data
    if (response.data && response.data.data) {
      // Filter out borrows with missing book or user data
      const validBorrows = response.data.data.filter(borrow => borrow && borrow.book && borrow.user);
      response.data.data = validBorrows;
      return response.data;
    }
    
    return { data: [] };
  } catch (error) {
    console.error('Error fetching borrows:', error);
    throw error;
  }
};

// Get borrow by id
const getBorrow = async (borrowId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.get(API_URL + borrowId, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching single borrow:', error);
    throw error;
  }
};

// Create new borrow
const createBorrow = async (borrowData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.post(API_URL, borrowData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating borrow:', error);
    throw error;
  }
};

// Return book
const returnBook = async (borrowId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.put(API_URL + borrowId, {}, config);
    return response.data;
  } catch (error) {
    console.error('Error returning book:', error);
    throw error;
  }
};

const borrowService = {
  getBorrows,
  getBorrow,
  createBorrow,
  returnBook
};

export default borrowService; 