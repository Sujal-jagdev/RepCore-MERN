import { configureStore } from '@reduxjs/toolkit'
import ProductReducer from './ProductSortSlice'

export const store = configureStore({
    reducer: {
        Product: ProductReducer
    }
})