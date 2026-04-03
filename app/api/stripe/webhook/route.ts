// app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createBrowserClient } from "@supabase/ssr"; // ← use this directly

export async function POST(req: NextRequest) {

  const body = await req.text();

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("No Stripe signature found");
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const customerEmail = session.customer_email;

    console.log("✅ Payment successful for:", customerEmail);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: dbError } = await supabase
      .from("users")
      .update({ is_pro: true })
      .eq("email", customerEmail);

    if (dbError) {
      console.error("Failed to update user:", dbError);
      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 }
      );
    }

    console.log("⭐ User upgraded to Pro:", customerEmail);
  }

  return NextResponse.json({ received: true });
}