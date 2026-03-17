

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PostVocabularyArg, VocabularyFetch, VocabularyResponse,} from "../features/vocabulary/vocabulary.type";
import { clientAPI } from "../utils/api/api";



export const fetchVocabularyByCategory = createAsyncThunk<VocabularyResponse[], number>('Vocabulary/fetchVocabularyByCategory',
    async(id : number) => {
        const response = await clientAPI.get<VocabularyFetch>(`Category/${id}/vocabularies`);
        return response.data.data.vocabulary ;
    }
);

export const postVocabularyByCategory = createAsyncThunk<{vocabulary : VocabularyResponse, countVocabulary : number},PostVocabularyArg>('Vocabulary/postVocabularyByCategory',
    async({id, data}) => {
        const response = await clientAPI.post(`Category/${id}/vocabularies`,data,);
        return response.data.data ;
    }
)

export const deleteVocabularyByCategory = createAsyncThunk<{categoryId : number, vocabularyId : number}, {categoryId : number, vocabularyId : number}>('Vocabulary/deleteVocabularyByCategory',
    async({categoryId, vocabularyId}) => {
        await clientAPI.delete(`Category/${categoryId}/vocabularies/${vocabularyId}`);
        return {
            categoryId,
            vocabularyId
        }
    }
)