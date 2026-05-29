import { Router } from "express";
import User from "../models/User.js";
import { formatUser, protect, signToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords don't match" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Min 6 characters" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    const user = await User.create({
      name,
      email,
      password,
      profile: { role: "" },
    });
    const token = signToken(user._id);
    return res.status(201).json({
      success: true,
      message: "Account created",
      user: { id: String(user._id), name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const token = signToken(user._id);
    return res.json({
      success: true,
      user: { id: String(user._id), name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
});

router.get("/me", protect, async (req, res) => {
  return res.json({ success: true, ...formatUser(req.user) });
});

export default router;
