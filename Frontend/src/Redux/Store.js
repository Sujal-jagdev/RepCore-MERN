import { configureStore } from '@reduxjs/toolkit'
import ProductReducer from './ProductSortSlice'
import GetOneProduct from './GetOneProductSlice'
import AddToCart from './AddToCartSlice'
import ordersReducer from "./OrderSlice";
import GetAllProduct from './AllProductSlice'

export const store = configureStore({
    reducer: {
        Product: ProductReducer,
        GetOneProduct,
        AddToCart,
        GetAllProduct,
        orders: ordersReducer,

    }
})