//app/api/sellers/add-product/routes.js

import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/authconfig";
import { connectDB } from "@/lib/db";
import { sellerCreateProduct } from "@/controllers/sellerproductcontroller";

export async function POST(req) {
  try {
    await connectDB();

    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "seller") {
      return NextResponse.json({ error: "Only sellers can add products" }, { status: 403 });
    }

    const formData = await req.formData();

    const productData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      price: formData.get("price"),
      sellerId: formData.get("sellerId"), // must match frontend
      images: [], // will store base64 or URLs later
    };

    const file = formData.get("image");
    if (file && typeof file === "object") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
      productData.images.push(base64Image);
    }

    const result = await sellerCreateProduct(productData, user);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Add Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
