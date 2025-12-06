//app/api/sellers/add-product/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/authconfig";
import { sellerCreateProduct } from "@/controllers/sellerproductcontroller";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req) {
  try {
    await connectDB();

    // ✅ Get authenticated user
    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "seller")
      return NextResponse.json(
        { error: "Only sellers can add products" },
        { status: 403 }
      );

    const formData = await req.formData();

    // ✅ Prepare product data
    const productData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      sellerId: user.id,
      images: [],
    };

    // ✅ Support multiple images
    const images = formData.getAll("image");
    for (const img of images) {
      if (img && typeof img === "object") {
        const buffer = Buffer.from(await img.arrayBuffer());
        const uploaded = await uploadImage(buffer); // should return { secure_url }
        productData.images.push(uploaded.secure_url);
      }
    }

    const newProduct = await sellerCreateProduct(productData, user);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("Add Product Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
