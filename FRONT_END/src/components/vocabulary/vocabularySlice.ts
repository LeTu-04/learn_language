import { createSlice } from "@reduxjs/toolkit";

let defaultStateVocabulary = {
    Vocabulary : [],
    loading : false,
    error : null

}

const vocabularySlice = createSlice({
    name : 'Vocabulary',
    initialState : defaultStateVocabulary,
    reducers : {

    },
    extraReducers : (builder) => {
        builder.addCase
    }
})

export const vocabularyReducer = vocabularySlice.reducer;