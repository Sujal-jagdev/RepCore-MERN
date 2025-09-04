const express = require("express");
const userRouter = express.Router();
require('dotenv').config()
const { 
    signup, 
    login, 
    logout, 
    profile, 
    verifyOTP, 
    resendOTP, 
    forgotPassword, 
    resetPassword,
    updateProfile 
} = require("../Controllers/Auth");
const isLoggedIn = require("../Middlewares/isLoggedin");
const upload = require("../Config/multerConfig");
const multer = require("multer");
const userModel = require("../Models/user");
const bcrypt = require("bcrypt");

// Authentication routes
userRouter.post("/signup", upload.single("userpicture"), signup);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/resend-otp", resendOTP);
userRouter.post("/login", login);
userRouter.get("/logout", logout);

// Password management
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.put("/change-password", isLoggedIn, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await userModel.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        
        // Hash new password
        const hash = await bcrypt.hash(newPassword, 10);
        user.password = hash;
        await user.save();
        
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
});

// Profile management
userRouter.get("/profile", isLoggedIn, profile);
userRouter.put("/profile", isLoggedIn, upload.single("userpicture"), updateProfile);

// Address management
userRouter.get("/addresses", isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ 
            message: "Addresses fetched successfully",
            addresses: user.address || [] 
        });
    } catch (error) {
        console.error("Fetch addresses error:", error);
        res.status(500).json({ message: "Error fetching addresses", error: error.message });
    }
});

userRouter.post("/addresses", isLoggedIn, async (req, res) => {
    try {
        const { name, street, city, state, pincode, country, phone, isDefault } = req.body;
        const user = await userModel.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Validate required fields
        if (!name || !street || !city || !state || !pincode || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Validate phone number format
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                message: "Invalid phone number format. Please enter a 10-digit number."
            });
        }
        
        // Validate pincode format
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(pincode)) {
            return res.status(400).json({
                message: "Invalid pincode format. Please enter a 6-digit number."
            });
        }
        
        // Create new address
        const newAddress = {
            name,
            street,
            city,
            state,
            pincode,
            country: country || 'India',
            phone,
            isDefault: isDefault || false
        };
        
        // If this is the first address or isDefault is true, set it as default
        if (isDefault || user.addresses.length === 0) {
            // Set all existing addresses to non-default
            user.addresses.forEach(addr => addr.isDefault = false);
            newAddress.isDefault = true;
        }
        
        // Add new address to user's addresses
        user.addresses.push(newAddress);
        await user.save();
        
        res.status(201).json({ 
            message: "Address added successfully",
            addresses: user.addresses 
        });
    } catch (error) {
        console.error("Add address error:", error);
        res.status(500).json({ message: "Error adding address", error: error.message });
    }
});

userRouter.put("/addresses/:addressId", isLoggedIn, async (req, res) => {
    try {
        const { addressId } = req.params;
        const { name, street, city, state, pincode, country, phone, isDefault } = req.body;
        const user = await userModel.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Find the address to update
        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
        
        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found" });
        }
        
        // Update address fields
        if (name) user.addresses[addressIndex].name = name;
        if (street) user.addresses[addressIndex].street = street;
        if (city) user.addresses[addressIndex].city = city;
        if (state) user.addresses[addressIndex].state = state;
        if (pincode) user.addresses[addressIndex].pincode = pincode;
        if (country) user.addresses[addressIndex].country = country;
        if (phone) user.addresses[addressIndex].phone = phone;
        
        // Handle default address setting
        if (isDefault) {
            // Set all addresses to non-default
            user.addresses.forEach(addr => addr.isDefault = false);
            // Set this address as default
            user.addresses[addressIndex].isDefault = true;
        }
        
        await user.save();
        
        res.status(200).json({ 
            message: "Address updated successfully",
            addresses: user.addresses 
        });
    } catch (error) {
        console.error("Update address error:", error);
        res.status(500).json({ message: "Error updating address", error: error.message });
    }
});

userRouter.delete("/addresses/:addressId", isLoggedIn, async (req, res) => {
    try {
        const { addressId } = req.params;
        const user = await userModel.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Find the address to delete
        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
        
        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found" });
        }
        
        // Check if this is the default address
        const isDefault = user.addresses[addressIndex].isDefault;
        
        // Remove the address
        user.addresses.splice(addressIndex, 1);
        
        // If the deleted address was the default and there are other addresses,
        // set the first one as default
        if (isDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }
        
        await user.save();
        
        res.status(200).json({ 
            message: "Address deleted successfully",
            addresses: user.addresses 
        });
    } catch (error) {
        console.error("Delete address error:", error);
        res.status(500).json({ message: "Error deleting address", error: error.message });
    }
});

module.exports = userRouter;