// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.status = 'loading';
        },
        loginSuccess(state, action) {
            state.status = 'succeeded';
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        loginFailure(state, action) {
            state.status = 'failed';
            state.error = action.payload;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('tradeToken')
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
