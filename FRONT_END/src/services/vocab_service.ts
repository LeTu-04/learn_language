
// import type { Vocabulary } from "../types/vocab";
// import axios, { type AxiosInstance } from 'axios'

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PostVocabularyArg, VocabularyFetch, VocabularyResponse,} from "../features/vocabulary/vocabulary.type";
import axios from "axios";

// export class VocabService {
//     private apiClient : AxiosInstance;
//     constructor(baseUrl : string = 'http://localhost:3000'){
//         this.apiClient = axios.create({
//             baseURL : baseUrl,
//             timeout : 10000,
//             headers : {
//                 "Content-Type" : 'application/json'
//             }
//         })
//     }
//     async postVocab(data : Vocabulary[]) {
//         const vocabPost = await this.apiClient.post<Vocabulary>('/vocab', data);
//         return vocabPost.data;
//     }

//     async getVocab () {
//         const vocab = await this.apiClient.get('/vocab');
//         console.log(vocab)
//         return vocab.data;
        
//     }
// }

// export const vocabService = new VocabService();

export const apiClient = axios.create({
    baseURL : 'http://localhost:3000',
    timeout : 10000,
    headers : {
        'Content-Type' : 'application/json'
    },
    
    
})

export const fetchVocabularyByCategory = createAsyncThunk<VocabularyResponse[], number>('Vocabulary/fetchVocabularyByCategory',
    async(id : number) => {
        const response = await apiClient.get<VocabularyFetch>(`Category/${id}/vocabularies`);
        return response.data.data.vocabulary ;
    }
);

export const postVocabularyByCategory = createAsyncThunk<{vocabulary : VocabularyResponse, countVocabulary : number},PostVocabularyArg>('Vocabulary/postVocabularyByCategory',
    async({id, data}) => {
        const response = await apiClient.post(`Category/${id}/vocabularies`,data,);
        return response.data.data ;
    }
)

export const deleteVocabularyByCategory = createAsyncThunk<{categoryId : number, vocabularyId : number}, {categoryId : number, vocabularyId : number}>('Vocabulary/deleteVocabularyByCategory',
    async({categoryId, vocabularyId}) => {
        await apiClient.delete(`Category/${categoryId}/vocabularies/${vocabularyId}`);
        return {
            categoryId,
            vocabularyId
        }
    }
)