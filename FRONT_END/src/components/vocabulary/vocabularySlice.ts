
import { createSlice } from "@reduxjs/toolkit";
import type { VocabularyState } from "../../types/vocabulary";
import { deleteVocabularyByCategory, fetchVocabularyByCategory, postVocabularyByCategory } from "../../services/vocab_service";

const defaultStateVocabulary : VocabularyState = {
    items : [],
    count : 0,
    loading : false,
    error : null

}

const vocabularySlice = createSlice({
    name : 'Vocabulary',
    initialState : defaultStateVocabulary,
    reducers : {
        // addVocabularyLocal : (state, action) => {
        //     state.Vocabulary.push(action.payload)
        // },
        // restoreAddVocabularyLocal : (state, action) => {
            
        // }    
    },
    extraReducers : (builder) => {
        builder.addCase(postVocabularyByCategory.pending, (state, action) => {
            const tempId = -Date.now();
            state.items.push({
                id : tempId,
                word : action.meta.arg.data.word,
                mean : action.meta.arg.data.mean,
                example : action.meta.arg.data.example,
                categoryId : action.meta.arg.id,
                isLoading : true,
                requestId : action.meta.requestId
            }),
            state.count += 1;
        }) .addCase(postVocabularyByCategory.fulfilled,(state, action)=> {
            const {vocabulary, countVocabulary} = action.payload ;
            const index = state.items.findIndex((i) => i.requestId === action.meta.requestId);
            if(index !== -1) {
                state.items[index] = vocabulary,
                state.count = countVocabulary
            }
        }).addCase(postVocabularyByCategory.rejected, (state, action) => {
           state.items = state.items.filter((i) => i.requestId !== action.meta.requestId);
           state.count -= 1;
           state.error = action.error.message ?? null
        }).addCase(fetchVocabularyByCategory.pending, (state) => {
            state.loading = true
        }).addCase(fetchVocabularyByCategory.fulfilled, (state, action) => {
            state.items = action.payload
            state.count = action.payload.length
        }).addCase(fetchVocabularyByCategory.rejected, (state, action) => {
            state.error = action.error.message ??'Có lỗi khi tải từ vựng'
        }).addCase(deleteVocabularyByCategory.fulfilled, (state, action) => {
            state.items = state.items.filter((v) => {
                return v.id !== action.payload.vocabularyId && v.categoryId === action.payload.categoryId
            });
            state.count -= 1;
        })
    }
})

export const vocabularyReducer = vocabularySlice.reducer;