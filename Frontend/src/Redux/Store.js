import { configureStore } from '@reduxjs/toolkit'
import ProductReducer from './ProductSortSlice'
import GetOneProduct from './GetOneProductSlice'
import AddToCart from './AddToCartSlice'

export const store = configureStore({
    reducer: {
        Product: ProductReducer,
        GetOneProduct,
        AddToCart
    }
})