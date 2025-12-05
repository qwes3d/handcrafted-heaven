// app/api/become-seller/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { auth } from "@/lib/authconfig";

export const POST = async (req) => {
  try {
    await connectDB();

    const session = await auth();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const userId = session.user.id || session.user._id;
;
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const formData = await req.formData();
    const businessName = formData.get("businessName");
    const address = formData.get("address");
    const phone = formData.get("phone");
    const bio = formData.get("bio");

    if (!businessName || !address || !phone || !bio) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
      });
    }

    // IMAGE HANDLING (if needed)
    const images = formData.getAll("image");
    const imagePaths = images.map((file) => file.name);

    // UPDATE USER TO BECOME SELLER
    user.role = "seller";
    user.businessName = businessName;
    user.address = address;
    user.phone = phone;
    user.bio = bio;
    user.sellerImages = imagePaths;

    await user.save();
    
    return new Response(
      JSON.stringify({ success: true, message: "Seller profile created" }),
      { status: 201 }
    
    );

  } catch (err) {
    console.error("BecomeSeller API Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
