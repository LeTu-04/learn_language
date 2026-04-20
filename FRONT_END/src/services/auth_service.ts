


import { clientAPI, } from "../utils/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginGoogleWithBackend = createAsyncThunk('Auth/looginGoogleWithBackend',
    async(tokenId : string) => {
        const response = await clientAPI.post('/auth/google', {
            tokenId
        }, {withCredentials : true}) ;

        return response.data ;
    }

)

export const refreshToken = createAsyncThunk('Auth/refreshToken',
    async() =>  {
        const response = await clientAPI.post('auth/refresh') ;
        return response.data.accessToken ;

    }
)

export const signUp = createAsyncThunk('Auth/signUp',
    async (body : {email : string, password : string}) => {
        const response = await clientAPI.post('/auth/signup', body, {withCredentials : true}) ;
        return response.data ;
    }
)

export const signIn = createAsyncThunk('Auth/signIn',
    async (body : {email : string, password : string}) => {
        const response = await clientAPI.post('/auth/signin', body, {withCredentials : true});
        return response.data ;
    }
)

export const logOut = createAsyncThunk('Auth/logOut', 
    async() => {
        const response = await clientAPI.post('/auth/logout');
        return response.data ;
    }
)
   
export const refresh = createAsyncThunk('Auth/refresh',
    async () => {
        const response = await clientAPI.get('/auth/refresh', {withCredentials : true});
        return response.data.newAccessToken ;
    }
)
