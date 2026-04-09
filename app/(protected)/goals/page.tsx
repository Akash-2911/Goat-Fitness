"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Target, Droplets, Flame, Quote } from "lucide-react"

// Motivational quotes that rotate daily
const quotes = [
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Success starts with self-discipline.", author: "Unknown" },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "Fitness is not about being better than someone else. It's about being better than you used to be.", author: "Unknown" },
  { text: "The hard days are the best because that's when champions are made.", author: "Gabby Douglas" },
  { text: "Don't wish for it. Work for it.", author: "Unknown" },
]

// Fitness facts to show on the page
const facts = [
  { icon: Flame, fact: "You burn calories even while sleeping — about 50 cal per hour.", color: "text-orange-400", bg: "bg-orange-400/10" },
  { icon: Droplets, fact: "Drinking water before meals can reduce calorie intake by up to 13%.", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Target, fact: "It takes 21 days to form a habit and 90 days to make it a lifestyle.", color: "text-[#C8FF00]", bg: "bg-[#C8FF00]/10" },
]

export default function GoalsPage() {
  const [calorieGoal, setCalorieGoal] = useState(2200)
  const [weightGoal, setWeightGoal] = useState(70)
  const [waterGoal, setWaterGoal] = useState(8)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  // Pick a quote based on the day so it changes daily
  const todayQuote = quotes[new Date().getDay() % quotes.length]

  const handleSaveGoals = async () => {
    try {
      setLoading(true)
      setMessage("")
      setIsError(false)

      const goalsToSave = [
        { type: "calories", target_value: calorieGoal, current_value: 0, deadline: null },
        { type: "weight", target_value: weightGoal, current_value: 0, deadline: null },
        { type: "water", target_value: waterGoal, current_value: 0, deadline: null },
      ]

      for (const goal of goalsToSave) {
        const response = await fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(goal),
        })

        if (!response.ok) throw new Error("Failed to save goals")
      }

      setMessage("Goals saved successfully!")
    } catch (error) {
      console.error(error)
      setMessage("Something went wrong. Please try again.")
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#C8FF00] text-xs font-semibold uppercase tracking-widest mb-2">Goals</p>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Your <span className="text-[#C8FF00]">targets</span>
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Set your fitness targets and update them anytime as your progress changes.
          </p>
        </div>

        {/* Daily motivational quote */}
        <div className="bg-[#111318] border border-[#C8FF00]/20 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <Quote className="w-5 h-5 text-[#C8FF00] shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium leading-relaxed">
                &ldquo;{todayQuote.text}&rdquo;
              </p>
              <p className="text-white/30 text-xs mt-2">— {todayQuote.author}</p>
            </div>
          </div>
        </div>

        {/* Fitness facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {facts.map((item, index) => (
            <div key={index} className="bg-[#111318] border border-white/8 rounded-2xl p-4">
              <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center mb-3`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <p className="text-white/50 text-xs leading-relaxed">{item.fact}</p>
            </div>
          ))}
        </div>

        {/* Goals inputs */}
        <div className="mb-6 rounded-2xl border border-white/8 bg-[#111318] p-6">
          <h2 className="mb-4 font-bold text-white">Daily goals</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Daily calories
              </label>
              <input
                type="number"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(Number(e.target.value))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C8FF00]/50"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Target weight (kg)
              </label>
              <input
                type="number"
                value={weightGoal}
                onChange={(e) => setWeightGoal(Number(e.target.value))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C8FF00]/50"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Daily water (glasses)
              </label>
              <input
                type="number"
                value={waterGoal}
                onChange={(e) => setWaterGoal(Number(e.target.value))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C8FF00]/50"
              />
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mb-6 rounded-2xl border border-white/8 bg-[#111318] p-6">
          <h2 className="mb-4 font-bold text-white">Current summary</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/5 bg-white/3 p-4">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Calories</p>
              <p className="text-2xl font-black text-[#C8FF00]">{calorieGoal}</p>
              <p className="text-xs text-white/30">kcal / day</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/3 p-4">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Weight</p>
              <p className="text-2xl font-black text-[#C8FF00]">{weightGoal}</p>
              <p className="text-xs text-white/30">kg target</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/3 p-4">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Water</p>
              <p className="text-2xl font-black text-[#C8FF00]">{waterGoal}</p>
              <p className="text-xs text-white/30">glasses / day</p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSaveGoals}
          disabled={loading}
          className="w-full rounded-full bg-[#C8FF00] py-4 text-base font-bold text-black transition-colors hover:bg-[#d4ff33] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save goals"}
        </button>

        {/* Message */}
        {message && (
          <div className={`mt-4 rounded-xl px-4 py-3 text-center text-sm ${
            isError
              ? "bg-red-500/10 border border-red-500/20 text-red-400"
              : "bg-green-500/10 border border-green-500/20 text-green-400"
          }`}>
            {message}
          </div>
        )}

      </main>
    </div>
  )
}