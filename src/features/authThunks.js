// src/features/auth/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../components/config';
import { loginStart, loginSuccess, loginFailure } from './authSlice';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({email, password}, { dispatch }) => {
    dispatch(loginStart());
    try {
      const response = await axios.post(`${config.BackendEndpoint}/login`, {email, password}); // Update with your actual login endpoint
      const {token} = response.data;
      localStorage.setItem("adminTrade", token);
      dispatch(loginSuccess(response.data));
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || error.message));
    }
  }
);
