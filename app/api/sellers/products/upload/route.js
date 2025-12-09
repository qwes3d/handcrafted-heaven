//app/api/sellers/products/upload/route.js

import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("image");

    if (!files || files.length === 0)
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: "products" }, (err, res) =>
            err ? reject(err) : resolve(res.secure_url)
          ).end(buffer);
        });
      })
    );

    return NextResponse.json({ uploadedImages }, { status: 200 });
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
