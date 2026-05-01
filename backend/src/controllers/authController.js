import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const normalizeRole = (role) => {
  if (typeof role !== "string") return "Member";
  const trimmed = role.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: normalizeRole(user.role) },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Signup Controller
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const normalizedRole = typeof role === "string"
      ? role.trim().charAt(0).toUpperCase() + role.trim().slice(1).toLowerCase()
      : "Member";

    const user = await User.create({
      name,
      email,
      password,
      role: normalizedRole || "Member",
    });

    const token = generateToken(user);

    res.status(201).json({
      jwt: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: normalizedRole,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Signin Controller
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const normalizedRole = normalizeRole(user.role);
    const token = generateToken(user);

    res.json({
      jwt: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: normalizedRole,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};