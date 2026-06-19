import { registerSchema } from "../config/zod.js";
import { loginSchema } from "../config/zod.js";
import { redisClient } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { User } from "../models/User.js";
import sanitize from "mongo-sanitize";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../config/sendMail.js";
import { getOtpHtml, getVerifyEmailHtml, getResetPasswordHtml } from "../config/html.js";
import {
  generateAccessToken,
  generateToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "../config/generateToken.js";

export const registerUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const validation = registerSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    const zodError = validation.error;
    let firstErrorMessage = "Validation failed";
    let allErrors = [];
    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allErrors = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));
      firstErrorMessage = allErrors[0]?.message || "Validation Error";
    }
    return res.status(400).json({ message: firstErrorMessage, error: allErrors });
  }

  const { name, email, password } = validation.data;

  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({ message: "Too many requests. Try again later." });
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const verifyKey = `register-verify:${normalizedEmail}`;

  const datatoStore = JSON.stringify({
    name,
    email: normalizedEmail,
    password: hashPassword,
    otp,
  });

  await redisClient.set(verifyKey, datatoStore, { EX: 300, });

  const subject = "Your verification code";
  const html = getOtpHtml({
    email: normalizedEmail,
    otp,
  });

  await sendMail({ email: normalizedEmail, subject, html });
  await redisClient.set(rateLimitKey, "True", { EX: 60 });

  res.status(201).json({
    message: "A verification code has been sent to your email. It expires in 5 minutes.",
  });
});

export const verifyUser= TryCatch(async(req, res) => {
    const {email, otp} = req.body;
    if (!email || !otp){
        return res.status(400).json({
            message: "Email and OTP are required.",
        });
    }

    const verifyKey= `register-verify:${email.toLowerCase()}`;

    const userdataJson= await redisClient.get(verifyKey);

    if (!userdataJson){
        return res.status(400).json({
            message: "Verification code expired or not found.",
        });
    }

    const userData= JSON.parse(userdataJson);

    if (userData.otp !== otp){
        return res.status(400).json({
            message: "Invalid verification code.",
        });
    }

    await redisClient.del(verifyKey);

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

    await generateToken(newUser._id, res);

    res.status(201).json({
        message: `Welcome ${newUser.name}! Your account is ready.`,
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
    });
});

export const loginUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const validation = loginSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    const zodError = validation.error;
    let firstErrorMessage = "Validation failed";
    let allErrors = [];
    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allErrors = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));
      firstErrorMessage = allErrors[0]?.message || "Validation Error";
    }
    return res.status(400).json({ message: firstErrorMessage, error: allErrors });
  }

  const { email, password } = validation.data;

  const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({ message: "Too many requests. Try again later." });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials." });

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) return res.status(400).json({ message: "Invalid credentials." });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, JSON.stringify(otp), { EX: 300 });

  const subject = "Your login OTP";
  const html = getOtpHtml({ email, otp });
  await sendMail({ email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.json({
    message: "If your email is valid, an OTP has been sent. It's valid for 5 minutes.",
  });
});

export const verifyOtp = TryCatch(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Please provide all details." });
  }

  const otpKey = `otp:${email}`;
  const storedOtpString = await redisClient.get(otpKey);
  if (!storedOtpString) return res.status(400).json({ message: "OTP expired." });

  const storedOtp = JSON.parse(storedOtpString);
  if (storedOtp !== otp) return res.status(400).json({ message: "Invalid OTP." });

  await redisClient.del(otpKey);
  const user = await User.findOne({ email });

  await generateToken(user._id, res);

  res.status(200).json({
    message: `Welcome ${user.name}`,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const myProfile = TryCatch(async (req, res) => {
  res.json({ user: req.user });
});

export const refreshToken = TryCatch(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided." });
  }

  const decode = await verifyRefreshToken(refreshToken);
  if (!decode) {
    return res.status(401).json({ message: "Invalid or expired refresh token." });
  }

  generateAccessToken(decode.id, res);
  res.status(200).json({ message: "Token refreshed." });
});

export const logoutUser = TryCatch(async (req, res) => {
  const userId = req.user._id;
  await revokeRefreshToken(userId);
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  await redisClient.del(`user:${userId}`);
  res.json({ message: "Logged out successfully." });
});

// ── Forgot Password ────────────────────────────────────────────────────────────
export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  const normalizedEmail = email.toLowerCase();

  // Always return generic message to avoid user enumeration
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.json({
      message: "If that email exists, a reset code has been sent.",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `reset-otp:${normalizedEmail}`;

  await redisClient.set(otpKey, JSON.stringify(otp), { EX: 300 }); // 5 minutes

  const subject = "Your password reset code";
  const html = getOtpHtml({ email: normalizedEmail, otp });
  await sendMail({ email: normalizedEmail, subject, html });

  res.json({ message: "If that email exists, a reset code has been sent." });
});

// ── Reset Password ─────────────────────────────────────────────────────────────
export const resetPassword = TryCatch(async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({ message: "Email, code, and new password are required." });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  const normalizedEmail = email.toLowerCase();
  const otpKey = `reset-otp:${normalizedEmail}`;

  const storedOtpString = await redisClient.get(otpKey);
  if (!storedOtpString) {
    return res.status(400).json({ message: "Reset code expired or not found." });
  }

  const storedOtp = JSON.parse(storedOtpString);
  if (storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid reset code." });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  await redisClient.del(otpKey);

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  // Invalidate any existing sessions
  await revokeRefreshToken(user._id);

  res.json({ message: "Password reset successfully. Please log in." });
});