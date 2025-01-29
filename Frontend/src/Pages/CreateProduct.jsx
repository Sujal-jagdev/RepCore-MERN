import React, { useState } from "react";
import axios from 'axios';
import { SiTicktick } from "react-icons/si";
import { GoAlertFill } from "react-icons/go";

const CreateProduct = () => {
    const [popuUp, setpopuUp] = useState(null)

    const [product, setProduct] = useState({
        image: "",
        name: "",
        price: "",
        discount: "",
        bgColor: "",
        category: "",
        subcategory: "",
        panelColor: "",
        textColor: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
            setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/product/create', product, { withCredentials: true })
            setpopuUp(true)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="container my-5">
            <h3 className="mb-4">Create New Product</h3>
            {
                popuUp ? <div className="alert alert-success d-flex align-items-center" role="alert">
                    <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><SiTicktick className='fs-5' /></svg>
                    <div>
                        Product Created Sucessfully...
                    </div>
                </div> : popuUp == null ? '' : <div class="alert alert-danger d-flex align-items-center" role="alert">
                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><GoAlertFill className='fs-5' /></svg>
                    <div>
                        Something Went Wrong!!
                    </div>
                </div>
            }
            <form onSubmit={handleSubmit} className="p-4 rounded border">
                {/* Product Image */}
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                        Product Image
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="image"
                        name="image"
                        onChange={handleChange}
                        placeholder="Enter product ImageURL"
                    />
                </div>

                {/* Product Name and Price */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">
                            Product Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="price" className="form-label">
                            Product Price
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="price"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            placeholder="Enter product price"
                        />
                    </div>
                </div>

                <div className=" row">
                    {/* Discount Price */}
                    <div className="mb-3 col-md-6">
                        <label htmlFor="discount" className="form-label">
                            Discount Price
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="discount"
                            name="discount"
                            value={product.discount}
                            onChange={handleChange}
                            placeholder="Enter discount price"
                        />
                    </div>

                    {/* Product Category */}
                    <div className="mb-3 col-md-6">
                        <label htmlFor="category" className="form-label">
                            Product Category
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="category"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            placeholder="Enter Product Category"
                        />
                    </div>

                    <div className="mb-3 col-md-6">
                        <label htmlFor="subcategory" className="form-label">
                            Product Sub Category
                        </label>
                        <br />
                        <select name="subcategory" onChange={handleChange} id="subcategory" value={product.subcategory} className="form-control col-12 p-2 fw-bold">
                            <option value="" className="fw-bold">Enter Product Sub Category</option>
                            <option value="Leggings" className="fw-bold">Leggings</option>
                            <option value="Short Leggings" className="fw-bold">Short Leggings</option>
                            <option value="Women Joggers" className="fw-bold">Women Joggers</option>
                            <option value="Women Hoodie" className="fw-bold">Women Hoodie</option>
                            <option value="Bras" className="fw-bold">Bras</option>
                            <option value="Men Shorts" className="fw-bold">Men Shorts</option>
                            <option value="Men Joggers" className="fw-bold">Men Joggers</option>
                            <option value="T-shirt" className="fw-bold">T-shirt</option>
                            <option value="Men Hoodie" className="fw-bold">Men Hoodie</option>
                            <option value="Accessories" className="fw-bold">Accessories</option>
                        </select>
                    </div>
                </div>

                {/* Panel Details */}
                <h5 className="mb-3">Panel Details</h5>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="bgColor" className="form-label">
                            Background Color
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="bgColor"
                            name="bgColor"
                            value={product.bgColor}
                            onChange={handleChange}
                            placeholder="Enter background color"
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="textColor" className="form-label">
                            Text Color
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="textColor"
                            name="textColor"
                            value={product.textColor}
                            onChange={handleChange}
                            placeholder="Enter text color"
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="panelColor" className="form-label">
                            Panel Color
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="panelColor"
                            name="panelColor"
                            value={product.panelColor}
                            onChange={handleChange}
                            placeholder="Enter panel color"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary">
                    Create New Product
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;