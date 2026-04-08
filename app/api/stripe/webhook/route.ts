import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error("Webhook verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { customer_email: string }
    const customerEmail = session.customer_email

    const supabase = await createClient()

    const { error: dbError } = await supabase
      .from("profiles")
      .update({ is_pro: true })
      .eq("email", customerEmail)

    if (dbError) {
      console.error("Failed to update user:", dbError)
      return NextResponse.json({ error: "Database update failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}