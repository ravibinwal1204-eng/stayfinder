import { Router } from "express";
import { protect, formatUser } from "../middleware/auth.js";
import { resolveImageUrl } from "../utils/saveImage.js";

const router = Router();

router.get("/profile", protect, (req, res) => {
  res.json({ success: true, profile: formatUser(req.user).profile });
});

router.put("/profile", protect, async (req, res) => {
  try {
    const body = req.body;
    const user = req.user;
    if (body.name) user.name = body.name;
    user.profile = {
      phone: body.phone ?? user.profile?.phone ?? "",
      dob: body.dob ?? user.profile?.dob ?? "",
      gender: body.gender ?? user.profile?.gender ?? "",
      address: body.address ?? user.profile?.address ?? "",
      city: body.city ?? user.profile?.city ?? "",
      occupation: body.occupation ?? user.profile?.occupation ?? "",
      bio: body.bio ?? user.profile?.bio ?? "",
      role: body.role ?? user.profile?.role ?? "",
      photo: user.profile?.photo ?? null,
    };
    if (body.photo !== undefined) {
      user.profile.photo = body.photo ? await resolveImageUrl(body.photo) : null;
    }
    await user.save();
    res.json({ success: true, profile: formatUser(user).profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Could not save profile" });
  }
});

export default router;
