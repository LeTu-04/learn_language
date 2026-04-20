import { configureStore } from '@reduxjs/toolkit'
import categoryReucer from "../features/Category/categorySlice";
import { vocabularyReducer } from '../features/vocabulary/vocabularySlice';
import { AuthReducer } from '../features/auth/auth.slice';

export const store = configureStore({
    reducer : {
        Category : categoryReucer,
        Vocabulary : vocabularyReducer,
        Auth : AuthReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;