import React, { useState } from "react";
import axios from 'axios';
import { SiTicktick } from "react-icons/si";
import { API } from '../Contexts/AllContext'
import { GoAlertFill } from "react-icons/go";
import { FaPlus, FaTrash } from "react-icons/fa";

const CreateProduct = () => {
    const [popuUp, setpopuUp] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const [product, setProduct] = useState({
        image: "",
        gallery: [],
        name: "",
        description: "",
        price: "",
        mrp: "",
        discount: "",
        bgColor: "",
        category: "",
        subcategory: "",
        colors: [],
        sizes: [],
        stock: "",
        panelColor: "",
        textColor: "",
    });

    const [newColor, setNewColor] = useState("");
    const [newSize, setNewSize] = useState("");
    const [newGalleryImage, setNewGalleryImage] = useState("");

    const mens_product = [
        "T-shirts",
        "Tank Tops",
        "Hoodies & Sweatshirts",
        "Shorts",
        "Joggers",
        "Compression Wear",
        "Jackets",
        "Gym Bags",
        "Gloves",
        "Belts",
        "Straps & Wraps",
        "Socks",
        "Caps",
        "Bottles & Shakers"
    ]

    const accessories = [
        "Gym Gloves",
        "Weight Lifting Belt",
        "Wrist Wraps",
        "Resistance Bands",
        "Shaker Bottle",
        "Gym Bag",
        "Foam Roller",
        "Jump Rope",
        "Water Bottle",
        "Smartwatch/Fitness Tracker"
    ]

    const womens_product = [
        "Sports Bra",
        "Leggings",
        "Gym Gloves",
        "Resistance Bands",
        "Yoga Mat",
        "Shaker Bottle",
        "Foam Roller",
        "Headbands/Hairbands",
        "Water Bottle",
        "Gym Bag"
    ]


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const addColor = () => {
        if (newColor.trim() !== "") {
            setProduct({
                ...product,
                colors: [...product.colors, newColor.trim()]
            });
            setNewColor("");
        }
    };

    const removeColor = (index) => {
        const updatedColors = [...product.colors];
        updatedColors.splice(index, 1);
        setProduct({
            ...product,
            colors: updatedColors
        });
    };

    const addSize = () => {
        if (newSize.trim() !== "") {
            setProduct({
                ...product,
                sizes: [...product.sizes, newSize.trim()]
            });
            setNewSize("");
        }
    };

    const removeSize = (index) => {
        const updatedSizes = [...product.sizes];
        updatedSizes.splice(index, 1);
        setProduct({
            ...product,
            sizes: updatedSizes
        });
    };

    const addGalleryImage = () => {
        if (newGalleryImage.trim() !== "") {
            setProduct({
                ...product,
                gallery: [...product.gallery, newGalleryImage.trim()]
            });
            setNewGalleryImage("");
        }
    };

    const removeGalleryImage = (index) => {
        const updatedGallery = [...product.gallery];
        updatedGallery.splice(index, 1);
        setProduct({
            ...product,
            gallery: updatedGallery
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (submitting) return;
            setSubmitting(true)
            await axios.post(`${API}/product/create`, product, { withCredentials: true })
            setpopuUp(true)
        } catch (error) {
            console.log(error)
            setpopuUp(false)
        } finally {
            setSubmitting(false)
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
                        Main Product Image URL <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="image"
                        name="image"
                        value={product.image}
                        onChange={handleChange}
                        placeholder="Enter main product image URL"
                        required
                    />
                </div>

                {/* Gallery Images */}
                <div className="mb-3">
                    <label className="form-label">Gallery Images</label>
                    <div className="input-group mb-2">
                        <input
                            type="text"
                            className="form-control"
                            value={newGalleryImage}
                            onChange={(e) => setNewGalleryImage(e.target.value)}
                            placeholder="Enter gallery image URL"
                        />
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={addGalleryImage}
                        >
                            <FaPlus />
                        </button>
                    </div>
                    {product.gallery.length > 0 && (
                        <div className="mt-2">
                            <p className="mb-1">Added Gallery Images:</p>
                            <ul className="list-group">
                                {product.gallery.map((img, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span className="text-truncate" style={{ maxWidth: "80%" }}>{img}</span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => removeGalleryImage(index)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Product Name and Description */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">
                            Product Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="description" className="form-label">
                            Product Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            placeholder="Enter product description"
                            rows="3"
                            required
                        ></textarea>
                    </div>
                </div>

                {/* Product Price Details */}
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="price" className="form-label">
                            Selling Price <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            placeholder="Enter selling price"
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="mrp" className="form-label">
                            MRP
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="mrp"
                            name="mrp"
                            value={product.mrp}
                            onChange={handleChange}
                            placeholder="Enter MRP (if different from price)"
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="discount" className="form-label">
                            Discount (%)
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="discount"
                            name="discount"
                            value={product.discount}
                            onChange={handleChange}
                            placeholder="Enter discount percentage"
                        />
                    </div>
                </div>

                {/* Product Category and Subcategory */}
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label htmlFor="category" className="form-label">
                            Product Category <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-control"
                            id="category"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="" className="fw-bold">Select Product Category</option>
                            <option value="Men" className="fw-bold">Men</option>
                            <option value="Women" className="fw-bold">Women</option>
                            <option value="Accessories" className="fw-bold">Accessories</option>
                        </select>
                    </div>

                    <div className="mb-3 col-md-6">
                        <label htmlFor="subcategory" className="form-label">
                            Product Sub Category
                        </label>
                        <select
                            name="subcategory"
                            onChange={handleChange}
                            id="subcategory"
                            value={product.subcategory}
                            className="form-control p-2"
                        >
                            <option value="" className="fw-bold">Select Product Sub Category</option>
                            {product.category === "Women" && (
                                <>
                                    {
                                        womens_product.map((e) => (
                                            <>
                                                <option value={e}>{e}</option>
                                            </>
                                        ))
                                    }
                                </>
                            )}
                            {product.category === "Men" && (
                                <>
                                    {
                                        mens_product.map((e) => (
                                            <>
                                                <option value={e}>{e}</option>
                                            </>
                                        ))
                                    }
                                </>
                            )}
                            {product.category === "Accessories" && (
                                <>
                                    {
                                        accessories.map((e) => (
                                            <>
                                                <option value={e}>{e}</option>
                                            </>
                                        ))
                                    }
                                </>
                            )}
                        </select>
                    </div>
                </div>

                {/* Inventory Details */}
                <h5 className="mb-3">Inventory Details</h5>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="stock" className="form-label">
                            Stock Quantity
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="stock"
                            name="stock"
                            value={product.stock}
                            onChange={handleChange}
                            placeholder="Enter available stock"
                        />
                    </div>

                    {/* Colors */}
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Available Colors</label>
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                                placeholder="Enter color name"
                            />
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={addColor}
                            >
                                <FaPlus />
                            </button>
                        </div>
                        {product.colors.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {product.colors.map((color, index) => (
                                    <div key={index} className="badge bg-light text-dark d-flex align-items-center p-2">
                                        {color}
                                        <button
                                            type="button"
                                            className="btn btn-sm text-danger ms-2 p-0"
                                            onClick={() => removeColor(index)}
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sizes */}
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Available Sizes</label>
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                                placeholder="Enter size (e.g., S, M, L)"
                            />
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={addSize}
                            >
                                <FaPlus />
                            </button>
                        </div>
                        {product.sizes.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {product.sizes.map((size, index) => (
                                    <div key={index} className="badge bg-light text-dark d-flex align-items-center p-2">
                                        {size}
                                        <button
                                            type="button"
                                            className="btn btn-sm text-danger ms-2 p-0"
                                            onClick={() => removeSize(index)}
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create New Product'}
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;