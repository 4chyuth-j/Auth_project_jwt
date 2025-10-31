import bcrypt from "bcryptjs";
import crypto from 'crypto';

import {User} from "../models/user.model.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import {generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendVerficationEmail, sendWelcomeEmail, sendResetPasswordSuccessEmail } from "../brevo/email.js";

export const signup = async(req,res)=>{
    const {email,password,name} = req.body
    try {
        if(!email || !password || !name){
            throw new Error("All fiels are required");
        }

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({success:false ,message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const verificationToken = generateVerificationCode();

        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt:Date.now() + 24*60*60*1000
        });

        const savedUser = await user.save();

        
        //jwt
        generateTokenAndSetCookie(res,savedUser._id);
        
        await sendVerficationEmail(savedUser.email,verificationToken);

        return res.status(201).json({
            success:true,
            message:"User created Successfully!",
            user:{
                ...savedUser._doc,
                password: undefined,
            },
        });
        
    } catch (error) {
        res.status(400).json({success:false, message:error.message});
    }
}

export const verifyEmail = async (req,res) => {
    //gets the 6 digit code
    const {code} = req.body;
    try {
       const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt:{$gt:Date.now()}
       });

       if(!user){
        return res.status(400).json({success:false, message: "Invalid or expired Verification code."})
       }

       user.isVerfied = true;
       user.verificationToken = undefined;
       user.verificationTokenExpiresAt = undefined;

       await user.save();

       await sendWelcomeEmail(user.email,user.name);

       return res.status(200).json({success:true, message:"Email verified successfully", user:{
        ...user._doc,
        password:undefined,
       }})

    } catch (error) {
         console.log("Error in verifyEmail controller",error);
         res.status(400).json({success:false, message:error.message})
    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false, message:"Invalid Credentials"});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({success:false, message:"Invalid Credentials"});
        }

        generateTokenAndSetCookie(res,user._id);

        user.lastLogin = new Date();

        await user.save();

        res.status(200).json({
            success:true,
            message:"Logged in Successfully",
            user:{
                ...user._doc,
                password:undefined,
            },
        })

    } catch (error) {
        console.log("Error in Loggin controller:",error);
        res.status(500).json({success:false, message:error.message})
    }
}

export const logout = async(req,res)=>{
    try {
        res.clearCookie("token");
        res.status(200).json({success: true, message:"Logged out Successfully."});
    } catch (error) {
        console.log("Error in logout controller:",error);
        res.status(400).json({success:false, message:error.message});
    }
}

export const forgotPassword = async (req,res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false, message:"Invalid User"});
        }

        //generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000; //1 hour from now

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

        await sendPasswordResetEmail(user.email, resetURL);
        
        res.status(200).json({success:true, message:"Password reset link sent to your email"})

    } catch (error) {
        console.log("Error in password reset controller:",error);
        res.status(400).json({success:false, message:error.message});
    }
}

export const resetPassword = async (req,res) => {
    try {
        const token = req.params.token;
        const {password} = req.body;

        const user = await User.findOne({resetPasswordToken:token, resetPasswordExpiresAt:{$gt: Date.now()}})

        if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired reset token"});
        }

        // updating password
        const hashedPassword = await bcrypt.hash(password,10);
        user.password = hashedPassword;

        //removing the token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        // saving the changes
        await user.save();

        await sendResetPasswordSuccessEmail(user.email);

        res.status(200).json({
            success:true,
            message:"Password Reset Successfully"
        });
    } catch (error) {
        console.log("Error in password reset success controller:",error);
        res.status(400).json({success:false, message:error.message});
    }
}

export const checkAuth = async (req,res) => {
    try {
        const user = await User.findById(req.userId);
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }
        res.status(200).json({
            success:true,
            user:{
                ...user._doc,
                password:undefined,
            }
        });

    } catch (error) {
        console.log("Error in check auth controller:",error);
        res.status(400).json({success:false, message:error.message});
    }
}