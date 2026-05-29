import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    city: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    area: { type: Number, default: 0 },
    type: { type: String, default: "Apartment" },
    bhk: { type: String, default: "2 BHK" },
    furnishing: { type: String, default: "Semi Furnished" },
    minLease: { type: Number, default: 12 },
    images: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerName: { type: String, required: true },
    ownerPhone: { type: String, default: "" },
    amenities: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    enquiries: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
