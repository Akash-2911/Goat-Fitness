import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase-server"

export async function POST() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to upgrade" },
        { status: 401 }
      )
    }

    const stripe = getStripe()

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
      success_url: `https://goat-fitness-iota.vercel.app/dashboard?upgraded=true`,
      cancel_url: `https://goat-fitness-iota.vercel.app/pricing`,
    })

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error("Stripe error:", error?.message)
    return NextResponse.json(
      { error: error?.message || "Stripe checkout failed" },
      { status: 500 }
    )
  }
}