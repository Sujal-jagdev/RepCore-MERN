import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../Contexts/AllContext";
import { LuPlus } from "react-icons/lu";
import { MdDelete, MdEdit, MdSearch } from "react-icons/md";
import { FaTable, FaThLarge, FaFilter, FaSort, FaSortUp, FaSortDown, FaBoxOpen } from "react-icons/fa";
import axios from 'axios';
import { API } from '../Contexts/AllContext';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import CreateProduct from "./CreateProduct";

const ShowProducts = () => {
    const { product, setproduct } = useContext(MyContext);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const navigate = useNavigate();

    // Get unique categories for filter dropdown
    const categories = ['all', ...new Set(product.map(item => item.category))];

    // Handle sorting
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Filter and sort products
    const filteredProducts = product
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.subcategory && item.subcategory.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortField === 'price') {
                return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
            } else {
                const valueA = a[sortField]?.toLowerCase() || '';
                const valueB = b[sortField]?.toLowerCase() || '';
                return sortDirection === 'asc' ?
                    valueA.localeCompare(valueB) :
                    valueB.localeCompare(valueA);
            }
        });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDeleteProduct = async (e) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        setIsLoading(true);
        try {
            const adminToken = Cookies.get('adminToken');
            await axios.delete(`${API}/product/deleteproduct/${e._id}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });

            // Update local state
            const updatedProducts = product.filter(p => p._id !== e._id);
            setproduct(updatedProducts);

            toast.success("Product deleted successfully!");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete product. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const handleAddNewProduct = () => {
        navigate('/admin/create');
    };

    // Get stock status class
    const getStockStatusClass = (stock) => {
        if (stock === undefined) return '';
        if (stock > 10) return 'stock-high';
        if (stock > 0) return 'stock-medium';
        return 'stock-low';
    };

    // Get stock status text
    const getStockStatusText = (stock) => {
        if (stock === undefined) return 'N/A';
        if (stock > 10) return `${stock} in stock`;
        if (stock > 0) return `${stock} in stock`;
        return 'Out of stock';
    };

    return (
        <div className="products-management">
            {/* Header Section */}
            <div className="products-header">
                <h2 className="products-title">Product Management</h2>
                <div className="products-actions">
                    <div className="view-toggle-group">
                        <button
                            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <FaThLarge /> Grid View
                        </button>
                        <button
                            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            <FaTable /> Table View
                        </button>
                    </div>
                    <button
                        className={`add-product-btn ${viewMode === 'addproduct' ? 'active' : ''}`}
                        onClick={() => setViewMode('addproduct')}>
                        <LuPlus /> Add New Product
                    </button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            {
                viewMode != 'addproduct' && <div className="products-filters">
                    <div className="filters-row">
                        <div className="filter-group">
                            <label className="filter-label">Search Products</label>
                            <div style={{ position: 'relative' }}>
                                <MdSearch style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#6c757d',
                                    fontSize: '1.1rem'
                                }} />
                                <input
                                    type="text"
                                    className="filter-input"
                                    placeholder="Search by name, category..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Category Filter</label>
                            <select
                                className="filter-select"
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category === 'all' ? 'All Categories' : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Items Per Page</label>
                            <select
                                className="filter-select"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={9}>9 items</option>
                                <option value={18}>18 items</option>
                                <option value={27}>27 items</option>
                                <option value={36}>36 items</option>
                            </select>
                        </div>
                    </div>
                </div>
            }


            {/* Loading Indicator */}
            {isLoading && (
                <div className="products-loading">
                    <div className="products-spinner"></div>
                </div>
            )}

            {/* No Results Message */}
            {!isLoading && filteredProducts.length === 0 && (
                <div className="products-empty">
                    <FaBoxOpen className="products-empty-icon" />
                    <h3 className="products-empty-title">No Products Found</h3>
                    <p className="products-empty-message">
                        No products match your search criteria. Try adjusting your filters or add new products.
                    </p>
                </div>
            )}

            {/* Grid View */}
            {!isLoading && viewMode === 'grid' && filteredProducts.length > 0 && (
                <div className="products-grid">
                    {currentItems.map((product, index) => (
                        <div key={index} className="product-card">
                            <div className="product-image-container">
                                <img
                                    className="product-image"
                                    src={product.image}
                                    alt={product.name}
                                />
                                <span className="product-category-badge">{product.category}</span>
                            </div>
                            <div className="product-card-body">
                                <h5 className="product-name">{product.name}</h5>
                                <div className="product-price-section">
                                    <div>
                                        <span className="product-price">₹{product.price}</span>
                                        {product.discount > 0 && (
                                            <span className="product-original-price">
                                                ₹{(product.price * (1 + product.discount / 100)).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`product-stock-badge ${getStockStatusClass(product.stock)}`}>
                                        {getStockStatusText(product.stock)}
                                    </span>
                                </div>
                                {product.subcategory && (
                                    <p className="product-subcategory">{product.subcategory}</p>
                                )}
                            </div>
                            <div className="product-actions">
                                <button
                                    className="action-btn action-btn-edit"
                                    onClick={() => handleEditProduct(product)}
                                >
                                    <MdEdit /> Edit
                                </button>
                                <button
                                    className="action-btn action-btn-delete"
                                    onClick={() => handleDeleteProduct(product)}
                                >
                                    <MdDelete /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Table View */}
            {!isLoading && viewMode === 'table' && filteredProducts.length > 0 && (
                <div className="products-table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>#</th>
                                <th style={{ width: '100px' }}>Image</th>
                                <th
                                    className="sortable"
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                    {sortField === 'name' && (
                                        sortDirection === 'asc' ?
                                            <FaSortUp className="sort-icon active" /> :
                                            <FaSortDown className="sort-icon active" />
                                    )}
                                    {sortField !== 'name' && <FaSort className="sort-icon" />}
                                </th>
                                <th
                                    className="sortable"
                                    onClick={() => handleSort('category')}
                                >
                                    Category
                                    {sortField === 'category' && (
                                        sortDirection === 'asc' ?
                                            <FaSortUp className="sort-icon active" /> :
                                            <FaSortDown className="sort-icon active" />
                                    )}
                                    {sortField !== 'category' && <FaSort className="sort-icon" />}
                                </th>
                                <th
                                    className="sortable"
                                    onClick={() => handleSort('price')}
                                >
                                    Price
                                    {sortField === 'price' && (
                                        sortDirection === 'asc' ?
                                            <FaSortUp className="sort-icon active" /> :
                                            <FaSortDown className="sort-icon active" />
                                    )}
                                    {sortField !== 'price' && <FaSort className="sort-icon" />}
                                </th>
                                <th>Stock</th>
                                <th style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((product, index) => (
                                <tr key={index}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-table-image"
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>
                                        <div className="product-table-category">
                                            <span className="product-category-badge">{product.category}</span>
                                            {product.subcategory && (
                                                <small style={{ color: '#6c757d', marginTop: '0.25rem' }}>
                                                    {product.subcategory}
                                                </small>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="product-price">₹{product.price}</span>
                                        {product.discount > 0 && (
                                            <small className="product-original-price">
                                                ₹{(product.price * (1 + product.discount / 100)).toFixed(2)}
                                            </small>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`product-stock-badge ${getStockStatusClass(product.stock)}`}>
                                            {getStockStatusText(product.stock)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="table-action-btn edit"
                                                onClick={() => handleEditProduct(product)}
                                                title="Edit Product"
                                            >
                                                <MdEdit />
                                            </button>
                                            <button
                                                className="table-action-btn delete"
                                                onClick={() => handleDeleteProduct(product)}
                                                title="Delete Product"
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {
                !isLoading && viewMode === 'addproduct' && filteredProducts.length > 0 && (
                    <CreateProduct />
                )
            }

            {/* Pagination */}
            {!isLoading && filteredProducts.length > 0 && viewMode != "addproduct" && (
                <div className="products-pagination">
                    <div className="pagination-info">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
                    </div>
                    <div className="pagination-controls">
                        <button
                            className="pagination-btn"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages).keys()].map(number => (
                            <button
                                key={number}
                                className={`pagination-btn ${currentPage === number + 1 ? 'active' : ''}`}
                                onClick={() => paginate(number + 1)}
                            >
                                {number + 1}
                            </button>
                        ))}
                        <button
                            className="pagination-btn"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditModal && selectedProduct && (
                <div className="product-modal">
                    <div className="product-modal-content">
                        <div className="product-modal-header">
                            <h5 className="product-modal-title">Edit Product: {selectedProduct.name}</h5>
                            <button
                                type="button"
                                className="product-modal-close"
                                onClick={() => setShowEditModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="product-modal-body">
                            <p style={{ textAlign: 'center', color: '#6c757d' }}>
                                Edit functionality will be implemented in the next phase.
                            </p>
                            <p style={{ textAlign: 'center', color: '#6c757d' }}>
                                For now, please use the Create Product page to add new products.
                            </p>
                        </div>
                        <div className="product-modal-footer">
                            <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                onClick={() => setShowEditModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowProducts;