import { createSlice } from "@reduxjs/toolkit"
import { fetchCategory, postCategory } from "../../services/category"
import type { CategoryState } from "../../types/category"



let init_Category :CategoryState = {
    Category : [],
    loading : false,
    error : undefined
}

const CategorySlice = createSlice({
    name : 'Category',
    initialState : init_Category,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(fetchCategory.pending, (state) => {
            state.loading = true;
        }).addCase(fetchCategory.fulfilled, (state, action) => {
            state.loading = false
            state.Category = action.payload
        }).addCase(fetchCategory.rejected, (state, action) => {
            state.loading = false 
            state.error = action.error.message 
        }).addCase(postCategory.pending, (state) => {
            state.loading = true
        }).addCase(postCategory.fulfilled, (state, action) => {
            state.loading = false,
            state.Category = action.payload
        }).addCase(postCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export default CategorySlice.reducer; 