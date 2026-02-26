import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { fetchCategory, postCategory } from "../../services/category"
import type { CategoryState } from "../../types/category"



let init_Category :CategoryState = {
    Category : [],
    loading : false,
    selectedCategory : null,
    error : undefined
}

const CategorySlice = createSlice({
    name : 'Category',
    initialState : init_Category,
    reducers : {
        removeCategoryLocal : (state, action) => {
            state.Category = state.Category.filter(
                (cat) => cat.id !== action.payload
            )
        },
        restoreCategory : (state,action) => {
            state.Category.push(action.payload)
        },
        editCategoryLocal : (state, action : PayloadAction<{id : number, name : string}>) => {
            const category = state.Category.find((cat) => cat.id === action.payload.id);
            if(category) {
                category.name = action.payload.name;
            }
        },
        setSelectedCategory : (state, action) => {
            state.selectedCategory = action.payload;
        },
        clearSelectedCategory : (state) => {
            state.selectedCategory = null;
        }
    },
    extraReducers : (builder) => {
        builder.addCase(fetchCategory.pending, (state) => {
            state.loading = true;
        }).addCase(fetchCategory.fulfilled, (state, action) => {
            state.loading = false
            state.Category = action.payload
            console.log(action.payload)
        }).addCase(fetchCategory.rejected, (state, action) => {
            state.loading = false 
            state.error = action.error.message 
        }).addCase(postCategory.pending, (state) => {
            state.loading = true
        }).addCase(postCategory.fulfilled, (state, action) => {
            state.loading = false,
            state.Category.push(action.payload)
            console.log(action.payload)
        }).addCase(postCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export default CategorySlice.reducer; 
export const { editCategoryLocal, removeCategoryLocal, restoreCategory, setSelectedCategory } = CategorySlice.actions