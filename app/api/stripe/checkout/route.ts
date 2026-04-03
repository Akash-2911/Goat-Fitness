
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createBrowserClient } from "@supabase/ssr"; // ← same fix as webhook
import { cookies } from "next/headers";

export async function POST() {

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to upgrade" },
      { status: 401 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "cad",
          product_data: {
            name: "GOAT Fitness Pro",
            description: "Monthly Pro subscription",
          },
          unit_amount: 499, 
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,

    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}