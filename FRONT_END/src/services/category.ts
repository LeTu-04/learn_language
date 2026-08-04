import { createAsyncThunk } from "@reduxjs/toolkit";

import type { CategoryPostResponse, CategoryResponse, getCat, postCat } from "../features/Category/category.type";
import { clientAPI } from "../utils/api/api";

export const baseUrl = import.meta.env.VITE_API_URL ||'http://localhost:3000';


export const fetchCategory = createAsyncThunk('Category/fetchCategory',
    async () => {
        const response = await clientAPI.get<CategoryResponse>('Category');
        return response.data.data;
    }
);

export const postCategory = createAsyncThunk('Category/postCategory',
    async (data: postCat) => {
        const response = await clientAPI.post<CategoryPostResponse>('Category', data);
        console.log('Data Post', response.data);
        return response.data.data;
    }
);

export const softDeleteCategory = createAsyncThunk('Category/softDeleteCategory',
    async (id: number) => {
        await clientAPI.delete(`/Category/${id}`);
        return id
    }
);

export const editCategory = createAsyncThunk('Category/editCategory',
    async ({ id, name }: getCat) => {
        const response = await clientAPI.patch(`/Category/${id}`, { name });
        return response.data;
    }
)


export const getQuizzExam = async (categoryId: number, limit?: number, view?: string) => {
    const response = await clientAPI.get(`Category/${categoryId}/exam`, {
        params: {
            limit,
            view
        }
    });
    return response.data
}

export const getCateRemoved = async () => {
    const response = await clientAPI.get<{
        message: string, data: { id: number, name: string, deletedAt: string }[]
    }>(`Category/removed`);
    return response.data.data;
}

export const restoreCategory = async (categoryId: number) => {
    try {
        const response = await clientAPI.patch(`Category/restore/${categoryId}`);
        return response.data.message
    } catch (error) {
        throw error
    }
}

export const deleteForeverCategory = async (categoryId: number) => {
    try {
        const response = await clientAPI.delete(`Category/delete-perm/${categoryId}`);
        return response.data.message;
    } catch (error) {
        throw error;
    }
}
