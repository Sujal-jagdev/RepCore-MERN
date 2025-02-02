import { configureStore } from '@reduxjs/toolkit'
import ProductReducer from './ProductSortSlice'
import GetOneProduct from './GetOneProductSlice'

export const store = configureStore({
    reducer: {
        Product: ProductReducer,
        GetOneProduct
    }
})