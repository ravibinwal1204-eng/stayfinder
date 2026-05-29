import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "stayfinder-dev-secret", {
    expiresIn: "7d",
  });
}

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "stayfinder-dev-secret");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export function formatUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    profile: {
      name: user.name,
      phone: user.profile?.phone || "",
      dob: user.profile?.dob || "",
      gender: user.profile?.gender || "",
      address: user.profile?.address || "",
      city: user.profile?.city || "",
      occupation: user.profile?.occupation || "",
      bio: user.profile?.bio || "",
      role: user.profile?.role || "",
      photo: user.profile?.photo || null,
    },
    wishlist: (user.wishlist || []).map((id) => String(id)),
  };
}
