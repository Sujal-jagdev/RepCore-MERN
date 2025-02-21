import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../Contexts/AllContext";

export const GetOneProduct = createAsyncThunk("ProductSort/GetOneProduct", async (id) => {
    try {
        const res = await axios.get(`${API}/product/getoneproduct/${id}`);
        return res.data.isProduct;
    } catch (error) {
        console.log(error)
    }
})

const initialState = {
    singleProduct: [],
    loading: false,
    error: null
}

const OneProductSlice = createSlice({
    name: "oneProduct",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(GetOneProduct.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(GetOneProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.singleProduct = action.payload;
            })
            .addCase(GetOneProduct.rejected, (state, action) => {
                state.error = true;
                console.error("API Error:", action.error);
            })
    }
})

export default OneProductSlice.reducer;