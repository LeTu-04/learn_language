import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { getCat, postCat } from "../types/category";

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
        const response  = await apiClient.get<getCat[]>('Category');
        return response.data
    }
);

export const postCategory = createAsyncThunk('Category/postCategory',
    async (data : postCat) => {
        const response = await apiClient.post('Category', data);
        return response.data;
    }
)