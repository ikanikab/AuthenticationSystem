//to create JWT tokens
import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";

export const generateToken = async (id, res) => {
    //Create Access Token
    const accessToken = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "1m",
    });
    
    //Create Refresh Token
    const refreshToken =  jwt.sign({id}, process.env.REFRESH_SECRET, {
        expiresIn: "7d",
    });
    
    const refreshTokenKey=  `refresh_token:$(id)`;
    await redisClient.setEx(refreshTokenKey, 7* 24* 60 * 60, refreshToken);

    //Send Access Token Cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        //secure: true,
        samesite: "strict",
        maxAge: 1*60* 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        maxAge: 7* 60* 24* 60* 1000,
        httpOnly: true,
        sameSite: "none",
        //secure: "true",
    });
    
    return {accessToken, refreshToken};
};