import { productCreateSchema } from "@/validation/validators";
import { connectDB } from "@/lib/db";
import Product from "@/models/products";
import { auth } from "@/lib/authconfig";
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
// app/api/products/route.js
export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const minPrice = parseFloat(url.searchParams.get("minPrice"));
    const maxPrice = parseFloat(url.searchParams.get("maxPrice"));
    const sellerId = url.searchParams.get("sellerId");

    const top = url.searchParams.get("top") === "true"; 
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    let query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }
    if (sellerId && sellerId.length === 24) query.sellerId = sellerId;

    let productsQuery = Product.find(query).sort({ createdAt: -1 });
    if (top) productsQuery = productsQuery.limit(4);
    else productsQuery = productsQuery.skip(skip).limit(limit);

    const products = await productsQuery.lean();
    const total = top ? products.length : await Product.countDocuments(query);

    return NextResponse.json({
      products,
      total,
      pages: top ? 1 : Math.ceil(total / limit),
      page: top ? 1 : page,
      categories: await Product.distinct("category"),
    });
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
};
