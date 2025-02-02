import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const getData = createAsyncThunk("ProductSort/getData", async (route) => {
    try {
        const res = await axios.get(`http://localhost:3000/product/${route}`);
        return res.data.products;
    } catch (error) {
        console.log(error)
    }
})

const initialState = {
    allproducts: [],
    products: [],
    loading: false,
    error: null
}

export const ProductSortSlice = createSlice({
    name: 'ProductSort',
    initialState,
    reducers: {
        sorting: (state, action) => {
            state.products = state.allproducts.filter((e) => e.subcategory == action.payload)
        },
        HLPrice: (state, action) => {
            state.products = state.allproducts.sort((a, b) => b.price - a.price)
        },
        LHPrice: (state, action) => {
            state.products = state.allproducts.sort((a, b) => a.price - b.price)
        },
        sortbyColor: (state, action) => {
            state.products = state.allproducts.filter((e) => e.bgColor == action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getData.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getData.fulfilled, (state, action) => {
                state.loading = false;
                state.allproducts = action.payload;
                state.products = action.payload;
            })
            .addCase(getData.rejected, (state, action) => {
                state.error = true;
                console.error("API Error:", action.error);
            })
    }
})

export const { sorting, HLPrice, LHPrice, sortbyColor } = ProductSortSlice.actions;
export default ProductSortSlice.reducer;