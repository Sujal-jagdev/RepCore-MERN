const express = require("express");
const userModel = require("../Models/user");
const bcrypt = require("bcrypt")
require('dotenv').config()
const jwt = require("jsonwebtoken");
const GenrateToken = require("../Utils/tokenGenrater");
const multer = require("multer");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Helper function to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send verification email
const sendVerificationEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'RepCore - Email Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #333;">Welcome to RepCore!</h2>
                <p>Thank you for registering with us. Please use the following OTP to verify your email address:</p>
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you didn't request this verification, please ignore this email.</p>
                <p>Best regards,<br>The RepCore Team</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

// Create User
module.exports.signup = async (req, res) => {
    const { fullname, email, password, contact } = req.body;

    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes

        // Hash Password
        const hash = await bcrypt.hash(password, 10);

        // Create user with verification pending
        const user = await userModel.create({
            fullname, 
            email, 
            password: hash, 
            contact, 
            userpicture: req.file ? req.file.buffer : undefined,
            isVerified: false,
            verificationOTP: {
                code: otp,
                expiresAt: otpExpiry
            }
        });

        // Send verification email
        await sendVerificationEmail(email, otp);

        res.status(201).json({ 
            message: "Registration successful! Please check your email for verification code.", 
            userId: user._id 
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Something went wrong during registration", error: error.message })
    }
}

// Verify OTP
module.exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        const now = new Date();
        if (now > user.verificationOTP.expiresAt) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one" });
        }

        if (user.verificationOTP.code !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Mark user as verified
        user.isVerified = true;
        user.verificationOTP = undefined;
        await user.save();

        // Just return success message, don't log in automatically
        res.status(200).json({ 
            message: "Email verified successfully! Please login to continue."
        });
    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ message: "Something went wrong during verification", error: error.message });
    }
};

// Resend OTP
module.exports.resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        // Update user with new OTP
        user.verificationOTP = {
            code: otp,
            expiresAt: otpExpiry
        };
        await user.save();

        // Send verification email
        await sendVerificationEmail(email, otp);

        res.status(200).json({ message: "New verification code sent to your email" });
    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Login User
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid Email Or Password!" })
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ 
                message: "Email not verified. Please verify your email first.",
                needsVerification: true,
                userId: user._id
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            // Update last login time
            user.lastLogin = new Date();
            await user.save();

            const token = GenrateToken(user);
            
            // Log token generation for debugging
            console.log('Generated token for user:', user.email);
            
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            }).status(200).json({ 
                message: "Welcome back to RepCore!", 
                token: token, // Include token in response
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    contact: user.contact,
                    isAuthenticated: true
                } 
            });
        } else {
            return res.status(400).json({ message: "Invalid Email Or Password!" })
        }
    } catch (error) {
       console.error("Login error:", error);
       return res.status(500).json({ message: "Something went wrong during login", error: error.message })
    }
}

// Logout User
module.exports.logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0)
    }).status(200).json({ message: "You have been logged out successfully" })
}

// Get user profile
module.exports.profile = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email })
            .select('-password -verificationOTP')
            .populate('wishlist', 'name image price discount');
            
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ message: "Profile retrieved successfully", user })
    } catch (error) {
        console.error("Profile retrieval error:", error);
        res.status(500).json({ message: "Error retrieving profile", error: error.message })
    }
}

// Forgot password - send reset email
module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "No account found with this email" });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token valid for 1 hour
        
        // Save token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();
        
        // Send reset email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'RepCore - Password Reset',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333;">Reset Your Password</h2>
                    <p>You requested a password reset for your RepCore account. Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>This link is valid for 1 hour. If you didn't request this reset, please ignore this email.</p>
                    <p>Best regards,<br>The RepCore Team</p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ message: "Password reset instructions sent to your email" });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// Reset password with token
module.exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    
    try {
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        
        // Hash new password
        const hash = await bcrypt.hash(newPassword, 10);
        
        // Update user password and clear reset token
        user.password = hash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        res.status(200).json({ message: "Password reset successful. You can now log in with your new password." });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// Update user profile
module.exports.updateProfile = async (req, res) => {
    const { fullname, contact, address } = req.body;
    
    try {
        const user = await userModel.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Update fields
        if (fullname) user.fullname = fullname;
        if (contact) user.contact = contact;
        if (address) {
            // If user doesn't have an address field yet, initialize it
            if (!user.address) user.address = {};
            
            // Update address fields
            if (address.street !== undefined) user.address.street = address.street;
            if (address.city !== undefined) user.address.city = address.city;
            if (address.state !== undefined) user.address.state = address.state;
            if (address.pincode !== undefined) user.address.pincode = address.pincode;
            if (address.country !== undefined) user.address.country = address.country;
        }
        if (req.file) user.userpicture = req.file.buffer;
        
        await user.save();
        
        res.status(200).json({ 
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                contact: user.contact,
                address: user.address
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
}