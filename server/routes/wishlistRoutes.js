import { Router } from "express";
import User from "../models/User.js";
import Property from "../models/Property.js";
import { protect } from "../middleware/auth.js";
import { formatProperty } from "../utils/formatProperty.js";

const router = Router();

router.get("/", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  const ids = (user.wishlist || []).map((p) => String(p._id || p));
  res.json({ success: true, ids, properties: (user.wishlist || []).map(formatProperty).filter(Boolean) });
});

router.post("/:propertyId", protect, async (req, res) => {
  const property = await Property.findById(req.params.propertyId);
  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found" });
  }
  const user = await User.findById(req.user._id);
  const id = property._id;
  if (!user.wishlist.some((w) => String(w) === String(id))) {
    user.wishlist.push(id);
    await user.save();
  }
  res.json({ success: true, ids: user.wishlist.map(String) });
});

router.delete("/:propertyId", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((w) => String(w) !== req.params.propertyId);
  await user.save();
  res.json({ success: true, ids: user.wishlist.map(String) });
});

export default router;
