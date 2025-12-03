// app/api/auth/become-seller/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { getUserFromRequest } from "@/lib/authconfig";
import formidable from "formidable";
import fs from "fs";
import path from "path";

await connectDB();

// Helper to save uploaded file(s)
const saveFiles = (files) => {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const urls = [];

  Object.values(files).forEach((fileItem) => {
    // Formidable may return an array if multiples=true
    const fileArray = Array.isArray(fileItem) ? fileItem : [fileItem];

    fileArray.forEach((file) => {
      // Optional: validate file type and size
      if (!file.mimetype.startsWith("image/")) return;

      const fileName = `${Date.now()}-${file.originalFilename}`;
      const filePath = path.join(uploadDir, fileName);

      fs.renameSync(file.filepath, filePath);
      urls.push(`/uploads/${fileName}`);
    });
  });

  return urls;
};

// Disable Next.js body parsing
//export const config = {
//api: { bodyParser: false },
//};

export const POST = async (req) => {
  try {
    const sessionUser = await getUserFromRequest();
    if (!sessionUser) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const user = await User.findById(sessionUser.id);
    if (!user || user.role === "seller") {
      return new Response(JSON.stringify({ error: "Already a seller or user not found" }), { status: 400 });
    }

    const form = formidable({ multiples: true });
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
    });

    // Update user fields
    user.businessName = fields.businessName || user.businessName;
    user.address = fields.address || user.address;
    user.phone = fields.phone || user.phone;
    user.bio = fields.bio || "";

    // Handle image upload
    if (files.image) {
      const uploadedUrls = saveFiles(files.image);
      if (uploadedUrls.length) user.profilePic = uploadedUrls[0]; // first image as profilePic
      if (uploadedUrls.length > 1) user.images = uploadedUrls; // store all uploaded images optionally
    }

    // Promote role
    user.role = "seller";

    await user.save();

    return new Response(JSON.stringify({ message: "You are now a seller!", user }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to become seller" }), { status: 500 });
  }
};
