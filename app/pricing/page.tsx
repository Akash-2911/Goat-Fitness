"use client";
import { useState } from "react";

export default function PricePage() {
    const [loading, setLoading] = useState(false);

    async function handleCheckout() {
        setLoading(true);

        try{
            const response = await fetch("/api/checkout", {
                method: "POST",
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            }
        } finally {
            setLoading(false);

        }
}
return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20">
        <div className="max-w-4x1 mx-auto text-center">
            
            <p className="text-[#C8FF00] text-sm font-semibold uppercase tracking-widest mb-4]">
                Pricing
            </p>

            <h1 className="text-5x1 font-black tracking-tighter mb-4">
                Simple, honest pricing
            </h1>

            <p className="text-white/50 text-lg mb-16">
                Start free. Upgrade when you&apos;re ready.
            </p>

            <div className="bg-[#111318] border border-white/8 rounded-2x1 p-8">
                <h2 className="text-x1 font-black tracking-tighter mb-2">Free</h2>
                <p className="text-5x1 font-black tracking-tighter mb-2">$0</p>
                <p className="text-white/40 text-sm mb-8">Forever free</p>

                <ul className="space-y-3 text-white/70 mb-8">
                    {[
                        "Log workouts",
                        "Track water intake",
                        "Basic nutrition log",
                        "Set fitness goals",
                        "View progress charts",
                    ].map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                            <span className="text-[#C8FF00] font-bold">✓</span>
                            {feature}
                        </li>
                    ))}
                </ul>
                
                <button className="w-full border border-white/10 text-white/40 px-6 py-3 rounded-full font-bold cursor-not-allowed">
                    Current Plan
                </button>
            </div>

            <div className="bg-[#111318] border border-[#C8FF00]/40 rounded-2xl p-8 relative">

              <div className="absolute top-5 right-5 bg-[#C8FF00] text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
              Popular
            </div> 

                 <h2 className="text-xl font-black tracking-tighter mb-2">Pro</h2>

                 <p className="text-5xl font-black tracking-tighter text-[#C8FF00] mb-2">
              $4.99
            </p>
            <p className="text-white/40 text-sm mb-6">per month</p>

                <ul className="space-y-3 text-white/70 mb-8">
              {[
                "Everything in Free",
                "Social feed & follow friends",
                "Share your workouts",
                "Advanced goal tracking",
                "Streak badges & achievements",
                "Priority support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="text-[#C8FF00] font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

               <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#C8FF00] text-black font-black px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {loading ? "Redirecting to Stripe..." : "Upgrade to Pro →"}
            </button>
          </div>

        </div>
    </main>
  );
}