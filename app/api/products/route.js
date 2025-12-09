// app/api/products/route.js
import { productCreateSchema } from "@/validation/validators";
import { connectDB } from "@/lib/db";
import Product from "@/models/products";
import { auth } from "@/lib/authconfig";
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const minPrice = parseFloat(url.searchParams.get("minPrice"));
    const maxPrice = parseFloat(url.searchParams.get("maxPrice"));
    const sellerId = url.searchParams.get("sellerId");

    let query = {};

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    // Filter by seller
    if (sellerId && sellerId.length === 24) {
      query.sellerId = sellerId;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (err) {
    console.error("Fetch Products Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const formData = await request.formData();

    // Validate input
    const validation = productCreateSchema.validate(
      {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        price: Number(formData.get("price")),
        sellerId: session.user.id,
      },
      { abortEarly: false }
    );

    if (validation.error) {
      return NextResponse.json(
        { error: validation.error.details.map(d => d.message) },
        { status: 400 }
      );
    }

    const productData = { ...validation.value, images: [] };

    // Upload images
    const files = formData.getAll("image");
    for (const file of files) {
      if (file && typeof file === "object") {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploaded = await uploadImage(buffer);
        productData.images.push(uploaded.secure_url);
      }
    }

    const newProduct = await Product.create(productData);
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err) {
    console.error("Add Product Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
