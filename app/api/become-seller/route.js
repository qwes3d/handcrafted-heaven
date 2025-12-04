// app/api/become-seller/route.js
import { connectDB } from "@/lib/db";
import Seller from "@/models/seller";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/authconfig"; // get session from your authconfig

export const POST = async (req) => {
  try {
    await connectDB();

    const user = await auth(); // get logged-in user
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const formData = await req.formData();

    const businessName = formData.get("businessName");
    const address = formData.get("address");
    const phone = formData.get("phone");
    const bio = formData.get("bio");

    if (!businessName || !address || !phone || !bio) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Handle images
    const images = formData.getAll("image"); // array of File objects
    const imagePaths = images.map((file) => file.name); // You may want to save files in cloud or server

    // Create new seller
    const newSeller = new Seller({
      sellerId: uuidv4(),
      userId: user.id,
      businessName,
      address,
      phone,
      bio,
      images: imagePaths,
    });

    await newSeller.save();

    return new Response(JSON.stringify({ message: "Seller created successfully" }), {
      status: 201,
    });
  } catch (err) {
    console.error("BecomeSeller API Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
