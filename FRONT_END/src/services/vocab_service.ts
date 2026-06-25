

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PostVocabularyArg, VocabularyFetch, VocabularyResponse,} from "../features/vocabulary/vocabulary.type";
import { clientAPI } from "../utils/api/api";




export const fetchVocabularyByCategory = createAsyncThunk<VocabularyResponse[], number>('Vocabulary/fetchVocabularyByCategory',
    async(id : number) => {
        const response = await clientAPI.get<VocabularyFetch>(`Category/${id}/vocabularies`);
        return response.data.data.vocabulary ;
    }
);

export const fetchAllFavoriteVocabulary = createAsyncThunk<VocabularyResponse[]>('Vocabulary/fetchAllFavoriteVocabulary',
    async() => {
        const response = await clientAPI.get<VocabularyFetch>(`Category/vocabularies/favorite`);
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

export const flushPendingFavorite = async() => {
    const pending = JSON.parse(localStorage.getItem('favoritepending') || '{}');
    if(Object.keys(pending).length === 0) return ;
    const changes = Object.entries(pending).map(([id, isFavorite]) => ({
        id : Number(id),
        isFavorite
    }));

    try {
        await clientAPI.patch('/Category/vocabularies/favorite', {changes}) ;
        localStorage.removeItem('favoritepending');
        
    } catch (error) {
        console.error('Lỗi xử lý ngầm pendingfavorite');
    }
}

// export const flushWithBeacon = () => {
//     const pending = JSON.parse(localStorage.getItem('favoritepending') || '{}');
//     if(Object.keys(pending).length === 0) return;
//     // object.entries đưa từ {} thành []
//     const changes = Object.entries(pending).map(([id, isFavorite]) => ({
//         id : Number(id),
//         isFavorite
//     }));

//     try {
//         const success = navigator.sendBeacon(
//             'http://localhost:3000/Category/vocabularies/favorite-beacon',
//             new Blob([JSON.stringify({changes})], {type : 'application/json'})
//         );
//         if(success) {
//             localStorage.removeItem('favoritepending')
//         }
//     } catch (error) {
//         logger.error('Không thể gửi favorite lên sever với Beacon', error);
//     }
// }

