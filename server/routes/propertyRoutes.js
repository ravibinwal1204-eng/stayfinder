import { Router } from "express";
import Property from "../models/Property.js";
import { protect } from "../middleware/auth.js";
import { formatProperty } from "../utils/formatProperty.js";
import { resolveImageList } from "../utils/saveImage.js";

const router = Router();

function buildFilter(query) {
  const filter = { available: true };
  if (query.city) filter.city = query.city;
  if (query.type) filter.type = query.type;
  if (query.bhk) filter.bhk = query.bhk;
  if (query.furnishing) filter.furnishing = query.furnishing;
  if (query.minPrice) filter.price = { ...filter.price, $gte: Number(query.minPrice) };
  if (query.maxPrice) filter.price = { ...filter.price, $lte: Number(query.maxPrice) };
  if (query.search) {
    const s = String(query.search).trim();
    filter.$or = [
      { title: new RegExp(s, "i") },
      { location: new RegExp(s, "i") },
      { city: new RegExp(s, "i") },
      { ownerName: new RegExp(s, "i") },
    ];
  }
  return filter;
}

router.get("/", async (req, res) => {
  try {
    const list = await Property.find(buildFilter(req.query)).sort({ createdAt: -1 });
    res.json({ success: true, properties: list.map(formatProperty) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to load properties" });
  }
});

router.get("/mine", protect, async (req, res) => {
  try {
    const list = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, properties: list.map(formatProperty) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to load your properties" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    property.views = (property.views || 0) + 1;
    await property.save();
    res.json({ success: true, property: formatProperty(property) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to load property" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const body = req.body;
    if (!body.title || !body.city || !body.price) {
      return res.status(400).json({ success: false, message: "Fill title, city & price" });
    }
    const images = await resolveImageList(body.images);
    const defaults = [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    ];
    const ownerName = req.user.profile?.name || req.user.name;
    const property = await Property.create({
      title: body.title,
      description: body.description || "No description",
      city: body.city,
      location: body.location ? `${body.location}, ${body.city}` : body.city,
      price: Number(body.price),
      deposit: Number(body.deposit) || Number(body.price) * 2,
      area: Number(body.area) || 0,
      type: body.type || "Apartment",
      bhk: body.bhk || "2 BHK",
      furnishing: body.furnishing || "Semi Furnished",
      minLease: Number(body.minLease) || 12,
      images: images.length ? images : defaults,
      owner: req.user._id,
      ownerName,
      ownerPhone: body.contact || req.user.profile?.phone || "",
      amenities: body.amenities || [],
    });
    res.status(201).json({ success: true, property: formatProperty(property) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Could not create property" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    if (String(property.owner) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }
    await property.deleteOne();
    res.json({ success: true, message: "Property removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Could not delete property" });
  }
});

router.post("/:id/enquiry", protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    if (String(property.owner) === String(req.user._id)) {
      return res.json({ success: true, property: formatProperty(property) });
    }
    property.enquiries = (property.enquiries || 0) + 1;
    await property.save();
    res.json({ success: true, property: formatProperty(property) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Could not record enquiry" });
  }
});

export default router;
