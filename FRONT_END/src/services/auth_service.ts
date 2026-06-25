


import { clientAPI } from "../utils/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginGoogleWithBackend = createAsyncThunk('Auth/looginGoogleWithBackend',
    async (tokenId: string, { rejectWithValue }) => {
        try {
            const response = await clientAPI.post('/auth/google', {
                tokenId
            }, { withCredentials: true });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const refreshToken = createAsyncThunk('Auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await clientAPI.post('auth/refresh');
            return response.data.accessToken;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const signUp = createAsyncThunk('Auth/signUp',
    async (body: { email: string; password: string; inputotp: string }, { rejectWithValue }) => {
        try {
            const response = await clientAPI.post('/auth/signup', body, { withCredentials: true });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const signIn = createAsyncThunk('Auth/signIn',
    async (body: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await clientAPI.post('/auth/signin', body, { withCredentials: true });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const logOut = createAsyncThunk('Auth/logOut',
    async (_, { rejectWithValue }) => {
        try {
            const response = await clientAPI.post('/auth/logout');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);
   
export const refresh = createAsyncThunk('Auth/refresh',
    async (_, { rejectWithValue }) => {
        try {
            const response = await clientAPI.get('/auth/refresh', { withCredentials: true });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);



