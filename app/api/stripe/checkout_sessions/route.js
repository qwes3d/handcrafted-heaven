// app/api/stripe/checkout_sessions/route.js

// ⚠️ Stripe temporarily disabled — not in use yet.
// Keeping a working endpoint so the frontend won't break.

export const dynamic = "force-dynamic"; // prevents build-time errors
export const runtime = "nodejs"; // ensures Node environment (safe fallback)

// --- ORIGINAL STRIPE CODE (COMMENTED OUT) ---
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   const { items, userId } = await req.json();

//   if (!items || items.length === 0) {
//     return new Response(JSON.stringify({ error: "No items in cart" }), { status: 400 });
//   }

//   const line_items = items.map(item => ({
//     price_data: {
//       currency: "usd",
//       product_data: {
//         name: item.title || item.name,
//         images: [item.image || ""],
//       },
//       unit_amount: Math.round(item.price * 100), // in cents
//     },
//     quantity: item.quantity,
//   }));

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items,
//     mode: "payment",
//     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
//     cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
//     metadata: { userId },
//   });

//   return new Response(JSON.stringify({ url: session.url }), { status: 200 });
// }

// --- END OF ORIGINAL CODE ---


// ⭐ ACTIVE TEMPORARY PLACEHOLDER (SAFE) ⭐
export async function POST() {
  return Response.json(
    {
      status: "ok",
      message: "Payment feature coming soon — no charges made.",
    },
    { status: 200 }
  );
}
