"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { CheckCircle, Zap } from "lucide-react"

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleCheckout() {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError("Something went wrong. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C8FF00] text-xs font-semibold uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h1 className="text-5xl font-black tracking-tighter mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-white/40 text-lg">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Free plan */}
          <div className="bg-[#111318] border border-white/8 rounded-2xl p-8">
            <div className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
              Free
            </div>
            <div className="text-5xl font-black mb-1">$0</div>
            <div className="text-white/30 text-sm mb-8">Forever free</div>

            <ul className="space-y-3 mb-8">
              {[
                "Workout logger",
                "Nutrition tracker",
                "Water tracker",
                "Set fitness goals",
                "View progress charts",
                "Last 7 days history",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-white/50">
                  <CheckCircle className="w-4 h-4 text-white/20 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              disabled
              className="w-full border border-white/10 text-white/30 font-semibold py-3 rounded-full cursor-not-allowed text-sm"
            >
              Current plan
            </button>
          </div>

          {/* Pro plan */}
          <div className="relative bg-[#C8FF00] rounded-2xl p-8 text-black">
            <div className="absolute top-4 right-4 bg-black/20 text-black text-[10px] font-black rounded-full px-3 py-1 uppercase tracking-widest">
              Popular
            </div>

            <div className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-4">
              Pro
            </div>
            <div className="text-5xl font-black mb-1">$4.99</div>
            <div className="text-black/40 text-sm mb-8">per month</div>

            <ul className="space-y-3 mb-8">
              {[
                "Everything in Free",
                "Unlimited history",
                "Social feed & follow friends",
                "Share your workouts",
                "Streak badges & achievements",
                "AI workout suggestions",
                "Priority support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-black/70">
                  <CheckCircle className="w-4 h-4 text-black shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-black text-[#C8FF00] font-bold py-3 rounded-full hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Redirecting to Stripe..." : "Upgrade to Pro →"}
            </button>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-white/20 text-xs mt-8">
          Secure payment powered by Stripe. Cancel anytime.
        </p>

      </main>
    </div>
  )
}