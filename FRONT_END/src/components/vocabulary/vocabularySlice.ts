import { createSlice } from "@reduxjs/toolkit";
import type { VocabularyState } from "../../types/vocabulary";
import { postVocabularyByCategory } from "../../services/vocab_service";

let defaultStateVocabulary : VocabularyState = {
    Vocabulary : [],
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
            state.Vocabulary.push({
                ...action.meta.arg.data,
                isOptimistic : true,
                requestId : action.meta.requestId,
                id : -Date.now(),
                categoryId : action.meta.arg.id
            });
        }) .addCase(postVocabularyByCategory.fulfilled,(state, action)=> {
            const index = state.Vocabulary.findIndex(v => v.requestId === action.meta.requestId);
            if (index !== -1) {
                state.Vocabulary[index] = action.payload
            }
        }).addCase(postVocabularyByCategory.rejected, (state, action) => {
            state.Vocabulary.filter((v) => v.requestId !== action.meta.requestId);
            state.error = action.error.message ?? null
        }) 
    }
})

export const vocabularyReducer = vocabularySlice.reducer;