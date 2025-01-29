import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { useEffect } from 'react';


export const getData = createAsyncThunk("ProductSort/getData", async () => {
    try {
        const res = await axios.get("http://localhost:3000/product/womensproducts");
        return res.data.products;
    } catch (error) {
        console.log(error)
    }
})

const initialState = {
    products: []
}

export const ProductSortSlice = createSlice({
    name: 'ProductSort',
    initialState,
    reducers: {
        leggings: (state, payload) => {
            console.log(JSON.stringify(state.products))
        }
    }
})

export const { leggings } = ProductSortSlice.actions;
export default ProductSortSlice.reducer;