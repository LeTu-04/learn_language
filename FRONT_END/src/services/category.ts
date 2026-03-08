import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { CategoryPostResponse, CategoryResponse, getCat, postCat } from "../features/Category/category.type";

export const baseUrl = 'http://localhost:3000';
const apiClient = axios.create({
    baseURL :baseUrl,
    timeout : 10000,
    headers : {
        'Content-Type' : 'application/json'
    }
})

export const fetchCategory = createAsyncThunk('Category/fetchCategory',
    async() => {
        const response  = await apiClient.get<CategoryResponse>('Category');
        return response.data.data;
    }
);

export const postCategory = createAsyncThunk('Category/postCategory',
    async (data : postCat) => {
        const response = await apiClient.post<CategoryPostResponse>('Category', data);
        console.log('Data Post',response.data);
        return response.data.data;
    }
);

export const softDeleteCategory = createAsyncThunk('Category/softDeleteCategory',
    async (id : number) => {
        await apiClient.delete(`/Category/${id}`);
        return id 
    }
);

export const editCategory = createAsyncThunk('Category/editCategory',
    async({id, name} : getCat) => {
        const response = await apiClient.patch(`/Category/${id}`, {name}) ;
        return response.data;
    }
)


