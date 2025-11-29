import { getUserFromRequest } from "@/lib/auth";
import { addReview, getReviews } from "@/controllers/reviewController";

export async function POST(request) {
  try {
    const user = await getUserFromRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const result = await addReview(data, user);

    return Response.json(result, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function GET({ params }) {
  try {
    const result = await getReviews(params.productId);
    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
