import { Router } from "express";
import ContactMessage from "../models/ContactMessage.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Fill required fields" });
    }
    await ContactMessage.create({ name, email, subject: subject || "", message });
    res.status(201).json({ success: true, message: "Message sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Could not send message" });
  }
});

export default router;
