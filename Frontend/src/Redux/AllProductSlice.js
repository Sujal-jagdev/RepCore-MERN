import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const GetallProduct = createAsyncThunk('AddToCart/GetAllProduct', async () => {
    try {
        let res = await axios.get('http://localhost:3000/product/allproducts');
        return res.data;
    } catch (error) {
        console.log(error)
    }
})

const initialState = {
    AllProduct: [],
    product: [],
    loading: false,
    error: null
}

const GetAllProduct = createSlice({
    name: "GetAllProduct",
    initialState,
    reducers: {
        GetProductFromID: (state, action) => {
            state.AllProduct.products.filter((e) => {
                for (let i = 0; i < action.payload.length; i++) {
                    if (e._id == action.payload[i]) {
                        state.product.push(e)
                    }
                }
                return false;
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetallProduct.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(GetallProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.AllProduct = action.payload;
            })
            .addCase(GetallProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
    }
})

export const { GetProductFromID } = GetAllProduct.actions;

export default GetAllProduct.reducer;