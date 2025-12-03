// src/pages/api/users/me/avatar.js
import dbConnect from "@/lib/db";
import User from "@/models/user";
import multer from "multer";
import nextConnect from "next-connect";
import fs from "fs";
import path from "path";
import { requireAuth } from "@/middleware/requireAuth";

// Configure multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads/avatars", // store locally
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only images allowed"));
    cb(null, true);
  },
});

const handler = nextConnect();

handler.use(upload.single("avatar")); // 'avatar' is field name

handler.put(async (req, res) => {
  await dbConnect();
  const sessionUser = await requireAuth(req, res);
  if (!sessionUser) return;

  try {
    const filePath = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      sessionUser.id,
      { avatar: filePath },
      { new: true }
    ).select("-password");
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export const config = {
  api: {
    bodyParser: false, // required for multer
  },
};

export default handler;
