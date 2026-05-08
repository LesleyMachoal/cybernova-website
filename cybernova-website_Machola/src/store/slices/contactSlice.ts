import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Inquiry } from '@/types';

interface ContactState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

const initialState: ContactState = {
  status: 'idle',
  error: null,
};

export const submitInquiry = createAsyncThunk(
  'contact/submitInquiry',
  async (data: Inquiry, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/inquiries`, data);
      return response.data;
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to submit inquiry';
      return rejectWithValue(message);
    }
  },
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetContactState(state) {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitInquiry.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitInquiry.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(submitInquiry.rejected, (state, action) => {
        state.status = 'error';
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'Failed to submit inquiry';
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;