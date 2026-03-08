import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./auth.type";
import { loginGoogleWithBackend, refreshToken } from "../../services/auth_service";

const initialAuth : AuthState = {
    user : null ,
    token : null,
    loading : false,
    error : null
}

const AuthSlice = createSlice({
    name : 'Auth',
    initialState : initialAuth,
    reducers : {

    },
    extraReducers : (builder) => {
        builder.addCase(loginGoogleWithBackend.pending, (state) => {
            state.loading = true;
        }).addCase(loginGoogleWithBackend.fulfilled, (state, action) => {
            state.user = action.payload.user ;
            state.token = action.payload.accessToken ;
            state.loading = false
        }).addCase(loginGoogleWithBackend.rejected,(state, action) => {
            state.loading = false ;
            state.error = action.error.message
        }).addCase(refreshToken.fulfilled, (state, action) => {
            state.token = action.payload ;
            state.loading = false;
        }).addCase(refreshToken.rejected, (state, action) => {
            state.loading = false ;
            state.error = action.error.message;
        }) 
    }
});

export const AuthReducer = AuthSlice.reducer