import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User } from "../models/User.js";

const router = express.Router();

//  Signup Route
router.post("/signup", async (req, res) => {
  const { username, email, password, userId, hostel } = req.body;

  // 1. Validation
  if (!username || !email || !password || !userId || !hostel) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
    });
  }

  try {
    // 2. Check if userId already exists
    const existingUserId = await User.findOne({ userId });
    if (existingUserId) {
      return res.status(409).json({
        status: false,
        field: "userId",
        message: "User ID already registered",
      });
    }

    // 3. Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        status: false,
        field: "email",
        message: "Email already registered",
      });
    }

    // 4. Hash password and save user
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userId, username, hostel, email, password: hashpassword });

    await newUser.save();
    return res.status(201).json({ status: true, message: "Record registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

//  Login Route
router.post("/login", async (req, res) => {
  const { userId, password, hostel } = req.body;

  if (!userId || !password || !hostel) {
    return res.status(400).json({
      status: false,
      message: "Missing fields. User ID, Password, and Hostel are required.",
    });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ status: false, message: "User is not registered" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ status: false, message: "Password is incorrect" });
    }

    if (hostel !== user.hostel) {
      return res.status(400).json({
        status: false,
        message: "Hostel does not match the registered hostel",
      });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.KEY, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    return res.json({
      status: true,
      message: "Login successfully",
      userId: user.userId,
      hostel: user.hostel,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
});

//  Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User is not registered!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: "5m" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: `http://localhost:5173/resetPassword/${token}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ status: true, message: "Email sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Error sending email" });
  }
});

//  Reset Password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const hashpassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashpassword });

    return res.status(200).json({ status: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: false, message: "Invalid or expired token" });
  }
});


const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: false, message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
};

//  Protected Route
router.get("/verify", verifyUser, (req, res) => {
  return res.status(200).json({ status: true, message: "Authorized" });
});

//  Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true, message: "Logged out successfully" });
});

export { router as UserRouter };
