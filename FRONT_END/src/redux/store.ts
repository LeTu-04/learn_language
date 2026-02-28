import { configureStore } from '@reduxjs/toolkit'
import categoryReucer from "../components/Category/categorySlice";
import { vocabularyReducer } from '../components/vocabulary/vocabularySlice';

export const store = configureStore({
    reducer : {
        Category : categoryReucer,
        Vocabulary : vocabularyReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;