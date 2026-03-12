import { createAsyncThunk } from "@reduxjs/toolkit";

import type { CategoryPostResponse, CategoryResponse, getCat, postCat } from "../features/Category/category.type";
import { clientAPI } from "../utils/api/api";

export const baseUrl = 'http://localhost:3000';


export const fetchCategory = createAsyncThunk('Category/fetchCategory',
    async() => {
        const response  = await clientAPI.get<CategoryResponse>('Category');
        return response.data.data;
    }
);

export const postCategory = createAsyncThunk('Category/postCategory',
    async (data : postCat) => {
        const response = await clientAPI.post<CategoryPostResponse>('Category', data);
        console.log('Data Post',response.data);
        return response.data.data;
    }
);

export const softDeleteCategory = createAsyncThunk('Category/softDeleteCategory',
    async (id : number) => {
        await clientAPI.delete(`/Category/${id}`);
        return id 
    }
);

export const editCategory = createAsyncThunk('Category/editCategory',
    async({id, name} : getCat) => {
        const response = await clientAPI.patch(`/Category/${id}`, {name}) ;
        return response.data;
    }
)


