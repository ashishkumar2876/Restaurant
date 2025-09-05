import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../brevo/email";

// Sign up user
// Sign up user
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullname, email, password, contact, admin } = req.body; // include admin
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate verification token
    const verificationToken = generateVerificationCode();
    
    // Create a new user
    user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      contact: Number(contact),
      admin: admin ?? false, // use provided value or default false
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    // Generate JWT token
    generateToken(res, user);

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Exclude password from user data
    const userWithoutPassword = await User.findOne({ email }).select("-password");

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
      return;
    }

    // Check password match
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
      return;
    }

    // Generate token
    generateToken(res, user);

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Exclude password from user data
    const userWithoutPassword = await User.findOne({ email }).select("-password");

    res.status(200).json({
      success: true,
      message: `Welcome back ${user.fullname}`,
      user: userWithoutPassword,
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { verificationCode } = req.body;
    
    // Check if the verification token is valid and not expired
    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    }).select("-password");
    
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
      return;
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.fullname);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user,
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Logout user
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie("token").status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(40).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
    
    // Save the reset token and expiration time
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);

    res.status(200).json({
      success: true,
      message: "Password reset link sent",
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    // Check if the token is valid and not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });
    
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
      return;
    }

    // Hash the new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    // Send success email
    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
   
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Check user authentication
export const checkAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.id; // This comes from the `isAuthenticated` middleware
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Update profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const { fullname, email, address, city, country, profilePicture } = req.body;

    let updatedData: any = {
      fullname,
      email,
      address,
      city,
      country,
    };

    // ✅ Upload only if a new profile picture is provided
    if (profilePicture) {
      
      const cloudResponse = await cloudinary.uploader.upload(profilePicture);
      updatedData.profilePicture = cloudResponse.secure_url;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
  
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
