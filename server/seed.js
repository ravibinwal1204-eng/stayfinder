import User from "./models/User.js";
import Property from "./models/Property.js";

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
];

const SAMPLES = [
  {
    title: "Spacious 2 BHK in Bandra",
    city: "Mumbai",
    location: "Bandra West, Mumbai",
    price: 45000,
    type: "Apartment",
    bhk: "2 BHK",
    furnishing: "Fully Furnished",
    area: 1100,
    amenities: ["WiFi", "AC", "Parking", "Lift"],
  },
  {
    title: "Modern Studio near Koramangala",
    city: "Bangalore",
    location: "Koramangala, Bangalore",
    price: 22000,
    type: "Studio",
    bhk: "Studio",
    furnishing: "Semi Furnished",
    area: 550,
    amenities: ["WiFi", "Power Backup", "Security"],
  },
  {
    title: "3 BHK Villa with Garden",
    city: "Pune",
    location: "Koregaon Park, Pune",
    price: 55000,
    type: "Villa",
    bhk: "3 BHK",
    furnishing: "Fully Furnished",
    area: 2200,
    amenities: ["WiFi", "AC", "Parking", "Garden", "Pool"],
  },
];

export async function seedIfEmpty() {
  const count = await Property.countDocuments();
  if (count > 0) return;

  let owner = await User.findOne({ email: "demo@stayfinder.in" });
  if (!owner) {
    owner = await User.create({
      name: "Demo Owner",
      email: "demo@stayfinder.in",
      password: "demo123",
      profile: { role: "owner", phone: "+91 98765 43210" },
    });
  }

  for (let i = 0; i < SAMPLES.length; i++) {
    const s = SAMPLES[i];
    await Property.create({
      ...s,
      description: `Beautiful ${s.bhk} ${s.type.toLowerCase()} available for long-term rent. Direct owner listing — zero brokerage.`,
      deposit: s.price * 2,
      minLease: 12,
      images: [SAMPLE_IMAGES[i % SAMPLE_IMAGES.length]],
      owner: owner._id,
      ownerName: owner.name,
      ownerPhone: owner.profile?.phone || "",
      rating: 4.5 + (i % 3) * 0.1,
      reviews: 12 + i * 3,
      views: 50 + i * 20,
      enquiries: i * 2,
    });
  }
  console.log("Seeded sample properties (demo owner: demo@stayfinder.in / demo123)");
}
