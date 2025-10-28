import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";

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


        return res.status(201).json({
            success:true,
            message:"User created Successfully!",
            user:{
                ...savedUser,
                password: undefined,
            },
        });
        
    } catch (error) {
        res.status(400).json({success:false, message:error.message});
    }
}

export const login = async(req,res)=>{
    res.send("login route");
}

export const logout = async(req,res)=>{
    res.send("logout route");
}