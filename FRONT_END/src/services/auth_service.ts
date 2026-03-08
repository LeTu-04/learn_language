

import { clientAPI, } from "../utils/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginGoogleWithBackend = createAsyncThunk('Auth/looginGoogleWithBackend',
    async(tokenId : string) => {
        const response = await clientAPI.post('auth/google', {
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

   


