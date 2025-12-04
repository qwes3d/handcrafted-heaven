import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { items, userId } = await req.json();

  if (!items || items.length === 0) {
    return new Response(JSON.stringify({ error: "No items in cart" }), { status: 400 });
  }

  const line_items = items.map(item => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.title || item.name,
        images: [item.image || ""],
      },
      unit_amount: Math.round(item.price * 100), // in cents
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"], // Add more later (mobile money)
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    metadata: { userId },
  });

  return new Response(JSON.stringify({ url: session.url }), { status: 200 });
}
