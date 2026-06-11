import { registerSchema } from "../config/zod.js";
import { loginSchema } from "../config/zod.js";
import { redisClient } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { User } from "../models/User.js";
import sanitize from "mongo-sanitize";
import bcrypt, { compare } from 'bcrypt';
import crypto from 'crypto';
import sendMail from "../config/sendMail.js";
import { getOtpHtml, getVerifyEmailHtml } from "../config/html.js";
import { generateAccessToken, generateToken, revokeRefreshToken, verifyRefreshToken } from "../config/generateToken.js";

export const registerUser = TryCatch(async (req, res) => {
    const sanitizedBody = sanitize(req.body);
    const validation = registerSchema.safeParse(sanitizedBody);

    if (!validation.success){
        const zodError= validation.error;
        let firstErrorMessage = "validation failed";
        let allErrors = [];

        if (zodError?.issues && Array.isArray(zodError.issues)){
            allErrors= zodError.issues.map((issue) => ({
                field: issue.path ? issue.path.join(".") : "unknown",
                message: issue.message || "Validation Error",
                code: issue.code,
            }));
            firstErrorMessage = allErrors[0]?.message || "Validation Error";
        }
        return res.status(400).json({
            message: firstErrorMessage,
            error: allErrors,
        });
    }
    const { name, email, password } = validation.data;

    const rateLimitKey=`register-rate-limit:${req.ip}:${email}`;
    
    if (await redisClient.get(rateLimitKey)){
        return res.status(429).json({
            message:"Too many requests, Try again later.",
        });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser= await User.findOne({email:normalizedEmail});
    if (existingUser){
        return res.status(400).json({
            message: "User already exists.",
        });
    }
    
    const hashPassword = await bcrypt.hash(password, 10);

    const verifyToken= crypto.randomBytes(32).toString("hex");

    const verifyKey= `verify:${verifyToken}`;

    const datatoStore = JSON.stringify({
        name, 
        email: normalizedEmail, 
        password: hashPassword,
    });

    await redisClient.set(verifyKey, datatoStore, {EX:300,});

    const subject= "Verify your email for Account Creation.";
    const html= getVerifyEmailHtml({
        email:normalizedEmail, 
        token:verifyToken,
    });
    
    await sendMail({
        email:normalizedEmail,  
        subject, 
        html,
    });

    await redisClient.set(rateLimitKey, "True", {EX:60,});

    res.status(201).json({ 
        message: 
        "A verification link has been sent to your email which will expire in 5 mintues.",
    });
});

export const verifyUser= TryCatch(async(req, res) => {
    const {token} = req.params;
    if (!token){
        return res.status(400).json({
            message: "Verification token is required.",
        });
    }

    const verifyKey= `verify:${token}`;

    const userdataJson= await redisClient.get(verifyKey);

    if (!userdataJson){
        return res.status(400).json({
            message: "Verification link is required.",
        });
    }

    await redisClient.del(verifyKey);

    const userData= JSON.parse(userdataJson);
    console.log("USER DATA:", userData);
    const existingUser= await User.findOne({email:userData.email});
    
    if (existingUser){
        return res.status(400).json({
            message: "User already exists.",
        });
    }

    const newUser= await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
    });

    res.status(201).json({
        message: "Email verified successfully! Your Account has been created.",
        user: {_id: newUser._id, 
            name: newUser.name, 
            email: newUser.email
        },
    });
});

export const loginUser = TryCatch(async(req, res) => {

    const sanitizedBody = sanitize(req.body);
    
    const validation = loginSchema.safeParse(sanitizedBody);

    if (!validation.success){
        const zodError= validation.error;
        let firstErrorMessage = "validation failed";
        let allErrors = [];

        if (zodError?.issues && Array.isArray(zodError.issues)){
            allErrors= zodError.issues.map((issue) => ({
                field: issue.path ? issue.path.join(".") : "unknown",
                message: issue.message || "Validation Error",
                code: issue.code,
            }));
            firstErrorMessage = allErrors[0]?.message || "Validation Error";
        }
        return res.status(400).json({
            message: firstErrorMessage,
            error: allErrors,
        });
    }
    const { email, password } = validation.data;

    const rateLimitKey= `login-rate-limit:${req.ip}:${email}`;
    if (await redisClient.get(rateLimitKey)){
        return res.status(429).json({
            message:"Too many requests, Try again later.",
        });
    }

    const user= await User.findOne({email});
    if (!user){
        return res.status(400).json({
            message:"Invalid Credentials",
        });
    }

    const comparePassword= await bcrypt.compare(password, user.password);

    if (!comparePassword){
        return res.status(400).json({
            message:"Invalid Credentials",
        });
    }

    const otp=Math.floor(100000 + Math.random()* 900000).toString();

    const otpKey= `otp:${email}`;
    await redisClient.set(otpKey, JSON.stringify(otp), {
        EX: 300,
    });

    const subject= 'Otp for verification';

    const html= getOtpHtml({email, otp});

    await sendMail({email, subject, html});

    await redisClient.set(rateLimitKey, "true", {
        EX: 60,
    });

    res.json({
        message: "If your email is valid, an otp has been sent which will be valid for 5 mins.",
    });
});

export const verifyOtp= TryCatch(async(req, res) =>{
    const { email, otp}= req.body;
    if (!email || !otp){
        return res.status(400).json({
            message: "Please provide all details.",
        });
    }
    const otpKey= `otp:${email}`;

    const storedOtpString = await redisClient.get(otpKey);
    if (!storedOtpString){
        return res.status(400).json({
            message: "otp expired.",
        });
    }

    const storedOtp= JSON.parse(storedOtpString);
    if (storedOtp!==otp){
        return res.status(400).json({
            message:"Invalid OTP",
        });
    }

    await redisClient.del(otpKey);
    let user= await User.findOne({email});

    const tokenData= await generateToken(user._id, res);

    res.status(200).json({
        message: `Welcome ${user.name}`,
        user,
    });
});

export const myProfile= TryCatch(async( req, res) => {
    const user= req.user;

    res.json(user);
});

export const refreshToken= TryCatch(async(req,res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken){
        return res.status(401).json({
            message: "Invalid refresh Token",
        });
    }
    const decode= await verifyRefreshToken(refreshToken)
    if (!decode){
        return res.status(401).json({
            message: "Invalid refresh token",
        });
    }
    generateAccessToken(decode.id, res);

    res.status(200).json({
        message:"Token refreshed",
    });
});

export const logoutUser = TryCatch(async( req, res) => {
    const userId= req.user._id;
    await revokeRefreshToken(userId);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    await redisClient.del(`user:${userId}`);

    res.json({
        message:'Logged out successfully!',
    });
})