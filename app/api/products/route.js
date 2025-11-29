import { productCreateSchema } from "@/validation/validators";
import { connectDB } from "@/lib/db";
import Product from "@/models/products";
import { auth } from "@/lib/authconfig";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const products = await Product.find({});
  return NextResponse.json(products);
}

export async function POST(request) {
  const session = await auth(request);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const body = await request.json();

  const { error, value } = productCreateSchema.validate(body, { abortEarly: false });
  if (error) {
    return NextResponse.json(
      { error: error.details.map(d => d.message) },
      { status: 400 }
    );
  }

  const newProduct = await Product.create({
    ...value,
    owner: session.user.id,
  });

  return NextResponse.json(newProduct, { status: 201 });
}
