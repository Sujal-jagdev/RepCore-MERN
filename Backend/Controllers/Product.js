const express = require("express")
const productModel = require("../Models/product");
const userModel = require("../Models/user");

// Retry helper for transient DB/network errors
async function executeWithRetry(operation, options = { retries: 3, delayMs: 250 }) {
    const { retries, delayMs } = options;
    let attempt = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            return await operation();
        } catch (error) {
            const isTransient = error?.code === 'ECONNRESET' ||
                error?.code === -4077 ||
                error?.name === 'MongoNetworkError' ||
                error?.message?.includes('ECONNRESET');
            if (!isTransient || attempt >= retries) {
                throw error;
            }
            attempt++;
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
}

module.exports.createPost = async (req, res) => {
    try {
        const { 
            image, 
            gallery, 
            name, 
            description, 
            price, 
            mrp, 
            discount, 
            category, 
            subcategory, 
            colors, 
            sizes, 
            stock,
            bgColor, 
            panelColor, 
            textColor 
        } = req.body;
        
        // Validate required fields
        if (!name || !price || !category || !description || !image) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        // Guard against duplicates: check if a product with same name/category/subcategory exists
        const existing = await productModel.findOne({
            name: name.trim(),
            category,
            subcategory: subcategory || { $in: [null, ""] }
        });
        if (existing) {
            return res.status(409).json({ message: "Product already exists in this category" });
        }
        
        // Create new product
        const newProduct = await productModel.create({
            image,
            gallery: gallery || [],
            name: name.trim(),
            description,
            price,
            mrp: mrp || price,
            discount: discount || 0,
            category,
            subcategory,
            colors: colors || [],
            sizes: sizes || [],
            stock: stock || 0,
            bgColor,
            panelColor,
            textColor
        });

        return res.status(201).json({ 
            message: "Product added successfully", 
            product: newProduct 
        });
    } catch (error) {
        // Handle duplicate key error from unique index
        if (error && error.code === 11000) {
            return res.status(409).json({ message: "Duplicate product: name already exists in this category/subcategory" });
        }
        console.error("Create product error:", error);
        return res.status(500).json({ message: "Error creating product", error: error.message });
    }
}

module.exports.getAllProducts = async (req, res) => {
    try {
        const { 
            category, 
            subcategory, 
            sort, 
            color, 
            minPrice, 
            maxPrice, 
            search,
            page = 1,
            limit = 12
        } = req.query;

        // Build filter object
        const filter = {};
        
        // Category filter
        if (category) {
            filter.category = category;
        }
        
        // Subcategory filter
        if (subcategory) {
            filter.subcategory = subcategory;
        }
        
        // Color filter
        if (color) {
            filter.colors = { $in: Array.isArray(color) ? color : [color] };
        }
        
        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        
        // Search by keyword
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);
        
        // Build sort object
        let sortOption = {};
        if (sort === 'price_asc') {
            sortOption.price = 1;
        } else if (sort === 'price_desc') {
            sortOption.price = -1;
        } else if (sort === 'newest') {
            sortOption.createdAt = -1;
        } else {
            // Default sort
            sortOption.createdAt = -1;
        }
        
        // Execute query with pagination (with retry)
        const products = await executeWithRetry(() => productModel.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit)));
        
        // Get total count for pagination (with retry)
        const totalProducts = await executeWithRetry(() => productModel.countDocuments(filter));
        const totalPages = Math.ceil(totalProducts / Number(limit));
        
        return res.status(200).json({ 
            message: "Products retrieved successfully", 
            products, 
            pagination: {
                totalProducts,
                totalPages,
                currentPage: Number(page),
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error("Get all products error:", error);
        return res.status(500).json({ message: "Error retrieving products", error: error.message });
    }
}

module.exports.GetMensProducts = async (req, res) => {
    try {
        const { 
            subcategory, 
            sort, 
            color, 
            minPrice, 
            maxPrice, 
            search,
            page = 1,
            limit = 12
        } = req.query;

        // Build filter object
        const filter = { category: 'Men' };
        
        // Subcategory filter
        if (subcategory) {
            filter.subcategory = subcategory;
        }
        
        // Color filter
        if (color) {
            filter.colors = { $in: Array.isArray(color) ? color : [color] };
        }
        
        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        
        // Search by keyword
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);
        
        // Build sort object
        let sortOption = {};
        if (sort === 'price_asc') {
            sortOption.price = 1;
        } else if (sort === 'price_desc') {
            sortOption.price = -1;
        } else if (sort === 'newest') {
            sortOption.createdAt = -1;
        } else {
            // Default sort
            sortOption.createdAt = -1;
        }
        
        // Execute query with pagination
        const products = await executeWithRetry(() => productModel.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit)));
            
        // Get total count for pagination (with retry)
        const totalProducts = await executeWithRetry(() => productModel.countDocuments(filter));
        const totalPages = Math.ceil(totalProducts / Number(limit));
        
        return res.status(200).json({ 
            message: "Men's products retrieved successfully", 
            products, 
            pagination: {
                totalProducts,
                totalPages,
                currentPage: Number(page),
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error("Get men's products error:", error);
        return res.status(500).json({ message: "Error retrieving men's products", error: error.message });
    }
}

module.exports.getWomensProducts = async (req, res) => {
    try {
        const { 
            subcategory, 
            sort, 
            color, 
            minPrice, 
            maxPrice, 
            search,
            page = 1,
            limit = 12
        } = req.query;

        // Build filter object
        const filter = { category: 'Women' };
        
        // Subcategory filter
        if (subcategory) {
            filter.subcategory = subcategory;
        }
        
        // Color filter
        if (color) {
            filter.colors = { $in: Array.isArray(color) ? color : [color] };
        }
        
        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        
        // Search by keyword
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);
        
        // Build sort object
        let sortOption = {};
        if (sort === 'price_asc') {
            sortOption.price = 1;
        } else if (sort === 'price_desc') {
            sortOption.price = -1;
        } else if (sort === 'newest') {
            sortOption.createdAt = -1;
        } else {
            // Default sort
            sortOption.createdAt = -1;
        }
        
        // Execute query with pagination
        const products = await productModel.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));
            
        // Get total count for pagination
        const totalProducts = await productModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / Number(limit));
        
        return res.status(200).json({ 
            message: "Women's products retrieved successfully", 
            products, 
            pagination: {
                totalProducts,
                totalPages,
                currentPage: Number(page),
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error("Get women's products error:", error);
        return res.status(500).json({ message: "Error retrieving women's products", error: error.message });
    }
}

module.exports.GetAccessories = async (req, res) => {
    try {
        const { 
            subcategory, 
            sort, 
            color, 
            minPrice, 
            maxPrice, 
            search,
            page = 1,
            limit = 12
        } = req.query;

        // Build filter object
        const filter = { category: 'Accessories' };
        
        // Subcategory filter
        if (subcategory) {
            filter.subcategory = subcategory;
        }
        
        // Color filter
        if (color) {
            filter.colors = { $in: Array.isArray(color) ? color : [color] };
        }
        
        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        
        // Search by keyword
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);
        
        // Build sort object
        let sortOption = {};
        if (sort === 'price_asc') {
            sortOption.price = 1;
        } else if (sort === 'price_desc') {
            sortOption.price = -1;
        } else if (sort === 'newest') {
            sortOption.createdAt = -1;
        } else {
            // Default sort
            sortOption.createdAt = -1;
        }
        
        // Execute query with pagination
        const products = await productModel.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));
            
        // Get total count for pagination
        const totalProducts = await productModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / Number(limit));
        
        return res.status(200).json({ 
            message: "Accessories retrieved successfully", 
            products, 
            pagination: {
                totalProducts,
                totalPages,
                currentPage: Number(page),
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error("Get accessories error:", error);
        return res.status(500).json({ message: "Error retrieving accessories", error: error.message });
    }
}

module.exports.deleteproduct = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete product error:", error);
        return res.status(500).json({ message: "Error deleting product", error: error.message });
    }
}

module.exports.GetOneProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await executeWithRetry(() => productModel.findById(id));
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        // Get related products (same category, different product)
        const relatedProducts = await executeWithRetry(() => productModel.find({
            category: product.category,
            _id: { $ne: id },
            subcategory: product.subcategory
        }).limit(4));
        
        return res.status(200).json({ 
            message: "Product retrieved successfully", 
            product, 
            relatedProducts 
        });
    } catch (error) {
        console.error("Get product error:", error);
        return res.status(500).json({ message: "Error retrieving product", error: error.message });
    }
}

module.exports.AddToCart = async (req, res) => {
    const { id } = req.params;
    const { quantity = 1, size, color } = req.body;
    const userID = req.user.id;

    try {
        // Check if product exists
        const product = await productModel.findById(id);
        if (!userID) {
            return res.status(401).json({ message: "Please login to use the cart feature" })
        }
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        
        // Get user
        const user = await userModel.findById(userID);
        
        // Check if product already in cart with same size and color
        const existingCartItem = user.cart.find(item => 
            item.productId.toString() === id && 
            item.size === size && 
            item.color === color
        );
        
        if (existingCartItem) {
            // Update quantity if product already in cart
            existingCartItem.quantity += Number(quantity);
        } else {
            // Add new product to cart
            user.cart.push({
                productId: id,
                quantity: Number(quantity),
                size,
                color
            });
        }
        
        await user.save();
        
        // Populate cart with product details
        await user.populate('cart.productId');
        
        return res.status(200).json({ 
            message: "Product added to cart successfully", 
            cart: user.cart 
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({ message: "Error adding product to cart", error: error.message })
    }
}

module.exports.RemoveCartProduct = async (req, res) => {
    const userID = req.user.id;
    const { id } = req.params;
    const { size, color } = req.body;
    
    if (!userID) {
        return res.status(401).json({ message: "Please login to use the cart feature" });
    }
    if (!id) {
        return res.status(404).json({ message: "Product not found" });
    }
    
    try {
        // Get user
        const user = await userModel.findById(userID);
        
        // Find the cart item index
        const cartItemIndex = user.cart.findIndex(item => 
            item.productId.toString() === id && 
            item.size === size && 
            item.color === color
        );
        
        if (cartItemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        
        // Remove the item from cart
        user.cart.splice(cartItemIndex, 1);
        await user.save();
        
        // Populate cart with product details
        await user.populate('cart.productId');
        
        return res.status(200).json({ 
            message: "Product removed from cart successfully", 
            cart: user.cart 
        });
    } catch (error) {
        console.error("Remove from cart error:", error);
        return res.status(500).json({ message: "Error removing product from cart", error: error.message })
    }
}

// Update cart item quantity
module.exports.updateCartQuantity = async (req, res) => {
    const { id } = req.params;
    const { quantity, size, color } = req.body;
    const userID = req.user.id;
    
    try {
        // Get user
        const user = await userModel.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Find the cart item
        const cartItem = user.cart.find(item => 
            item.productId.toString() === id && 
            item.size === size && 
            item.color === color
        );
        
        if (!cartItem) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        
        // Update quantity
        cartItem.quantity = Number(quantity);
        
        // Remove item if quantity is 0
        if (cartItem.quantity <= 0) {
            const cartItemIndex = user.cart.findIndex(item => 
                item.productId.toString() === id && 
                item.size === size && 
                item.color === color
            );
            user.cart.splice(cartItemIndex, 1);
        }
        
        await user.save();
        
        // Populate cart with product details
        await user.populate('cart.productId');
        
        return res.status(200).json({ 
            message: "Cart updated successfully", 
            cart: user.cart 
        });
    } catch (error) {
        console.error("Update cart error:", error);
        return res.status(500).json({ message: "Error updating cart", error: error.message });
    }
}

// Get cart
module.exports.getCart = async (req, res) => {
    const userID = req.user.id;
    
    try {
        // Get user with populated cart
        const user = await userModel.findById(userID).populate('cart.productId');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({ 
            message: "Cart retrieved successfully", 
            cart: user.cart 
        });
    } catch (error) {
        console.error("Get cart error:", error);
        return res.status(500).json({ message: "Error retrieving cart", error: error.message });
    }
}

// Clear cart
module.exports.clearCart = async (req, res) => {
    const userID = req.user.id;
    try {
        const user = await userModel.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.cart = [];
        await user.save();
        return res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error("Clear cart error:", error);
        return res.status(500).json({ message: "Error clearing cart", error: error.message });
    }
}

// Add to wishlist
module.exports.addToWishlist = async (req, res) => {
    const { id } = req.params;
    const userID = req.user.id;
    
    try {
        // Check if product exists
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        // Get user
        const user = await userModel.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Check if product already in wishlist
        if (user.wishlist.includes(id)) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }
        
        // Add to wishlist
        user.wishlist.push(id);
        await user.save();
        
        // Populate wishlist with product details
        await user.populate('wishlist');
        
        return res.status(200).json({ 
            message: "Product added to wishlist successfully", 
            wishlist: user.wishlist 
        });
    } catch (error) {
        console.error("Add to wishlist error:", error);
        return res.status(500).json({ message: "Error adding product to wishlist", error: error.message });
    }
}

// Remove from wishlist
module.exports.removeFromWishlist = async (req, res) => {
    const { id } = req.params;
    const userID = req.user.id;
    
    try {
        // Get user
        const user = await userModel.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Check if product in wishlist
        if (!user.wishlist.includes(id)) {
            return res.status(404).json({ message: "Product not found in wishlist" });
        }
        
        // Remove from wishlist
        user.wishlist = user.wishlist.filter(productId => productId.toString() !== id);
        await user.save();
        
        // Populate wishlist with product details
        await user.populate('wishlist');
        
        return res.status(200).json({ 
            message: "Product removed from wishlist successfully", 
            wishlist: user.wishlist 
        });
    } catch (error) {
        console.error("Remove from wishlist error:", error);
        return res.status(500).json({ message: "Error removing product from wishlist", error: error.message });
    }
}

// Get wishlist
module.exports.getWishlist = async (req, res) => {
    const userID = req.user.id;
    
    try {
        // Get user with populated wishlist
        const user = await userModel.findById(userID).populate('wishlist');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({ 
            message: "Wishlist retrieved successfully", 
            wishlist: user.wishlist 
        });
    } catch (error) {
        console.error("Get wishlist error:", error);
        return res.status(500).json({ message: "Error retrieving wishlist", error: error.message });
    }
}

// Add product review
module.exports.addReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userID = req.user.id;
    
    try {
        // Check if product exists
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        // Create review
        const review = {
            userId: userID,
            user: req.user._id,  // Store user reference for population
            rating: Number(rating),
            comment,
            status: 'pending', // Reviews need approval as per PRD
            createdAt: new Date()
        };
        
        // Add review to product
        product.reviews.push(review);
        await product.save();
        
        return res.status(201).json({ 
            message: "Review submitted successfully and pending approval", 
            review 
        });
    } catch (error) {
        console.error("Add review error:", error);
        return res.status(500).json({ message: "Error submitting review", error: error.message });
    }
}

// Get product reviews
module.exports.getProductReviews = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Find product and populate user information in reviews
        const product = await productModel.findById(id)
            .populate({
                path: 'reviews.user',
                select: 'name email' // Only select name and email fields
            });
            
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        return res.status(200).json({
            success: true,
            reviews: product.reviews || []
        });
    } catch (error) {
        console.error("Get reviews error:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error retrieving reviews", 
            error: error.message 
        });
    }
}