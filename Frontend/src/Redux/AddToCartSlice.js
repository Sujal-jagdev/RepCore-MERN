import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { GetallProduct } from "./AllProductSlice";


export const AddProductToCart = createAsyncThunk('AddToCart/AddProductToCart', async (id) => {
    try {
        let res = await axios.post(`http://localhost:3000/product/addtocart/${id}`, {}, { withCredentials: true })
        alert("Product Add SucessFully At Cart")
        return res.data;
    } catch (error) {
        Navigate("/login")
        console.log(error)
    }
})

export const GetCartProduct = createAsyncThunk('AddToCart/GetCartProduct', async () => {
    try {
        let res = await axios.get(`http://localhost:3000/user/profile`, { withCredentials: true });
        return res.data.user.cart;
    } catch (error) {
        Navigate('/login')
        console.log(error)
    }
})

const initialState = {
    cartData: [],
    AllProducts: [],
    loading: false,
    error: null
}

const AddToCart = createSlice({
    name: "AddToCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(AddProductToCart.pending, (state, action) => {
                loading: true;
            })
            .addCase(AddProductToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(AddProductToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
            .addCase(GetCartProduct.pending, (state, action) => {
                loading: true;
            })
            .addCase(GetCartProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(GetCartProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
    }
})

export default AddToCart.reducer;