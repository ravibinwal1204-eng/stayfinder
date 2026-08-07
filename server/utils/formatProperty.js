export function formatProperty(doc) {
  if (!doc) return null;
  const p = doc.toObject ? doc.toObject() : doc;
  const created = p.createdAt ? new Date(p.createdAt) : new Date();
  const days = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
  return {
    id: String(p._id),
    ownerId: p.owner ? String(p.owner._id || p.owner) : undefined,
    title: p.title,
    description: p.description || "",
    city: p.city,
    location: p.location,
    price: p.price,
    deposit: p.deposit ?? p.price * 2,
    area: p.area ?? 0,
    type: p.type,
    bhk: p.bhk,
    furnishing: p.furnishing,
    images: p.images?.length ? p.images : [],
    videos: p.videos?.length ? p.videos : [],
    owner: p.ownerName || "Owner",
    ownerPhone: p.ownerPhone || "",
    amenities: p.amenities || [],
    rating: p.rating ?? 0,
    reviews: p.reviews ?? 0,
    available: p.available !== false,
    minLease: p.minLease ?? 12,
    postedDaysAgo: days,
    views: p.views ?? 0,
    enquiries: p.enquiries ?? 0,
  };
}
