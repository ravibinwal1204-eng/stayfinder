import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const profileSchema = new mongoose.Schema(
  {
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    gender: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    occupation: { type: String, default: "" },
    bio: { type: String, default: "" },
    role: { type: String, default: "" },
    photo: { type: String, default: null },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    profile: { type: profileSchema, default: () => ({}) },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
