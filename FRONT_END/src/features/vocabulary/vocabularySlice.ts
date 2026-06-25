
import { createSlice } from "@reduxjs/toolkit";
import type { VocabularyState } from "./vocabulary.type";
import { deleteVocabularyByCategory, fetchVocabularyByCategory, postVocabularyByCategory, fetchAllFavoriteVocabulary } from "../../services/vocab_service";

const defaultStateVocabulary : VocabularyState = {
    items : [],
    search : '',
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
        setSearchVocabulary : (state, action) => {
            state.search = action.payload ;
        } ,
        toogleFavorite : (state, action) => {
            const vocabId = action.payload;
            const item = state.items.find((i) => i.id === vocabId);
            if(item) {
                item.isFavorite = !item.isFavorite
            }
        },
        clearVocabularyState : (state) => {
            state.items = [];
            state.search = '';
            state.count = 0;
            state.loading = false;
            state.error = null;
        }
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
                requestId : action.meta.requestId,
                isFavorite : false
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
            state.loading = false
        }).addCase(fetchVocabularyByCategory.rejected, (state, action) => {
            state.error = action.error.message ??'Có lỗi khi tải từ vựng'
            state.loading = false
        }).addCase(fetchAllFavoriteVocabulary.pending, (state) => {
            state.loading = true
        }).addCase(fetchAllFavoriteVocabulary.fulfilled, (state, action) => {
            state.items = action.payload
            state.count = action.payload.length
            state.loading = false
        }).addCase(fetchAllFavoriteVocabulary.rejected, (state, action) => {
            state.error = action.error.message ?? 'Có lỗi khi tải từ vựng yêu thích'
            state.loading = false
        }).addCase(deleteVocabularyByCategory.fulfilled, (state, action) => {
            state.items = state.items.filter((v) => {
                return v.id !== action.payload.vocabularyId && v.categoryId === action.payload.categoryId
            });
            state.count -= 1;
        })
    }
})

export const vocabularyReducer = vocabularySlice.reducer;
export const {setSearchVocabulary, toogleFavorite, clearVocabularyState} = vocabularySlice.actions ;