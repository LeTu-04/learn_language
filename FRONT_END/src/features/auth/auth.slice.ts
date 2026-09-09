import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./auth.type";
import { loginGoogleWithBackend, logOut, refresh, refreshToken, signIn, signUp } from "../../services/auth_service";

const initialAuth : AuthState = {
    user : null ,
    token : null,
    loading : true,
    error : null
}

const handleFullfill = (state : AuthState, action : any) => {
    state.loading = false,
    state.token = action.payload.accessToken,
    state.user = action.payload.user 
    state.error = null
}
const handlePending = (state : AuthState, ) => {
    state.loading = true,
    state.error  = null
}
const handleRejected = (state : AuthState, action : any) => {
    state.loading = false,
    state.error = action.error.message
}

const AuthSlice = createSlice({
    name : 'Auth',
    initialState : initialAuth,
    reducers : {
        clearDataAfterLogout : (state) => {
            state.token = null;
            state.user = null ;
            state.error = null;
        },
        updateAvatar : (state, action) => {
            if (state.user) {
                state.user.avatarUrl = action.payload;
            }
        }
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
        }).addCase(signUp.pending, handlePending)
        .addCase(signUp.fulfilled, handleFullfill)
        .addCase(signUp.rejected, handleRejected)
        .addCase(signIn.pending, handlePending)
        .addCase(signIn.fulfilled, handleFullfill)
        .addCase(signIn.rejected, handleRejected)
        .addCase(refresh.fulfilled, (state, action) => {
            state.loading = false,
            state.token = action.payload.newAccessToken,
            state.user = action.payload.user
        }).addCase(refresh.pending, (_state) => {
           
        }).addCase(refresh.rejected, (state) => {
            state.loading = false
            state.token = null
            state.user = null
        })
    }
});

export const { clearDataAfterLogout, updateAvatar } = AuthSlice.actions;
export const AuthReducer = AuthSlice.reducer