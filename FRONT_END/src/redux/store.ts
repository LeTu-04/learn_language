import { configureStore } from '@reduxjs/toolkit'
import categoryReucer from "../components/Category/categorySlice";

export const store = configureStore({
    reducer : {
        Category : categoryReucer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;