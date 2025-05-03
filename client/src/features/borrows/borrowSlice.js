import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import borrowService from './borrowService';

const initialState = {
  borrows: [],
  borrow: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get user borrows
export const getBorrows = createAsyncThunk(
  'borrows/getAll',
  async (_, thunkAPI) => {
    try {
      console.log('getBorrows thunk starting');
      const state = thunkAPI.getState();
      const token = state.auth.user?.token;
      
      if (!token) {
        console.error('No token available for getBorrows');
        return thunkAPI.rejectWithValue('Authentication required');
      }
      
      const response = await borrowService.getBorrows(token);
      console.log('getBorrows thunk response:', response);
      return response;
    } catch (error) {
      console.error('getBorrows thunk error:', error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get borrow by ID
export const getBorrow = createAsyncThunk(
  'borrows/get',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await borrowService.getBorrow(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new borrow
export const createBorrow = createAsyncThunk(
  'borrows/create',
  async (borrowData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await borrowService.createBorrow(borrowData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Return book
export const returnBook = createAsyncThunk(
  'borrows/return',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await borrowService.returnBook(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const borrowSlice = createSlice({
  name: 'borrow',
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBorrows.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(getBorrows.fulfilled, (state, action) => {
        console.log('getBorrows.fulfilled payload:', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.borrows = action.payload.data || [];
      })
      .addCase(getBorrows.rejected, (state, action) => {
        console.error('getBorrows.rejected payload:', action.payload);
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        // Don't reset borrows to an empty array on error
      })
      .addCase(getBorrow.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getBorrow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.borrow = action.payload.data;
      })
      .addCase(getBorrow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBorrow.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(createBorrow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload.data) {
          state.borrows.push(action.payload.data);
        }
        state.message = 'Book borrowed successfully';
      })
      .addCase(createBorrow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(returnBook.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(returnBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload.data && state.borrows.length > 0) {
          state.borrows = state.borrows.map((borrow) =>
            borrow._id === action.payload.data._id ? action.payload.data : borrow
          );
        }
      })
      .addCase(returnBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = borrowSlice.actions;
export default borrowSlice.reducer; 