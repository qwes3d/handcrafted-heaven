import Seller from "@/models/seller"; 
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    
    const sellers = await Seller.find().select("id name");

    return Response.json(sellers);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
