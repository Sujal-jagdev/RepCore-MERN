import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../Contexts/AllContext";

export const GetallProduct = createAsyncThunk('AddToCart/GetAllProduct', async () => {
    try {
        let res = await axios.get(`${API}/product/allproducts`);
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
            // Clear previous products first to avoid duplicates
            state.product = [];
            
            // Only proceed if AllProduct and products exist
            if (state.AllProduct && state.AllProduct.products) {
                // Log for debugging
                console.log("AllProduct products count:", state.AllProduct.products.length);
                console.log("Filtering products with IDs:", action.payload);
                
                // Filter products based on IDs in action.payload
                state.AllProduct.products.forEach((product) => {
                    if (action.payload.includes(product._id)) {
                        state.product.push(product);
                    }
                });
                
                // Log the result
                console.log("Filtered products count:", state.product.length);
            } else {
                console.log("AllProduct or products not available yet");
            }
        },
        setProduct: (state, action) => {
            // Set product state directly with the provided array
            state.product = action.payload;
            console.log("Product state updated with", action.payload.length, "items");
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

export const { GetProductFromID, setProduct } = GetAllProduct.actions;

export default GetAllProduct.reducer;