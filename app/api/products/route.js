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
    const owner = url.searchParams.get("owner") || ""; // optional filter by seller

    let query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (owner) query.owner = owner;

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
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const formData = await request.formData();

    const validation = productCreateSchema.validate(
      {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        price: Number(formData.get("price")),
        owner: session.user.id,
      },
      { abortEarly: false }
    );

    if (validation.error) {
      return NextResponse.json(
        { error: validation.error.details.map((d) => d.message) },
        { status: 400 }
      );
    }

    const productData = { ...validation.value, images: [] };

    // Handle multiple images
    const files = formData.getAll("image"); // <input multiple>
    for (const file of files) {
      if (file && typeof file === "object") {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploaded = await uploadImage(buffer); // Cloudinary upload
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
