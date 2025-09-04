import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { API } from "../Contexts/AllContext";

export const AddProductToCart = createAsyncThunk('AddToCart/AddProductToCart', async (payload, { rejectWithValue }) => {
    try {
        // Handle both old format (just id) and new format (object with productId, quantity, etc.)
        let productId, quantity = 1, color, size;
        
        if (typeof payload === 'string' || (typeof payload === 'object' && !payload.productId)) {
            // Old format: just the id
            productId = payload;
        } else {
            // New format: object with productId, quantity, color, size
            ({ productId, quantity = 1, color, size } = payload);
        }
        
        let res = await axios.post(`${API}/product/addtocart/${productId}`, {
            quantity,
            color,
            size
        }, { withCredentials: true })
        
        alert("Product Added Successfully to Cart")
        return res.data; // This should contain { message, cart }
    } catch (error) {
        console.log("Add to cart error:", error);
        if (error.response?.status === 401) {
            Navigate("/login");
        }
        return rejectWithValue(error.response?.data?.message || "Failed to add product to cart");
    }
})

export const GetCartProduct = createAsyncThunk('AddToCart/GetCartProduct', async () => {
    try {
        let res = await axios.get(`${API}/user/profile`, { withCredentials: true });
        return res.data.user.cart;
    } catch (error) {
        Navigate('/login')
        console.log(error)
    }
})

export const RemoveingCartProduct = createAsyncThunk('AddToCart/RemoveCartProduct', async (id) => {
    try {
        let res = await axios.post(`${API}/product/user/removeproduct/${id}`, {}, { withCredentials: true })
        return res;
    } catch (error) {
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
                // Update cart data with the response from backend
                if (action.payload && action.payload.cart) {
                    state.cartData = action.payload.cart;
                }
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
                state.cartData = action.payload || [];
                console.log("Cart data loaded:", action.payload);
            })
            .addCase(GetCartProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
            .addCase(RemoveingCartProduct.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(RemoveingCartProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // Immediately update cart count by removing 1 from current cart
                if (state.cartData && state.cartData.length > 0) {
                    state.cartData = state.cartData.slice(0, -1);
                }
            })
            .addCase(RemoveingCartProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
    }
})

export default AddToCart.reducer;
