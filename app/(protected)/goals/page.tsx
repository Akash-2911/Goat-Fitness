"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";

export default function GoalsPage() {
  const [calorieGoal, setCalorieGoal] = useState(2200);
  const [weightGoal, setWeightGoal] = useState(70);
  const [waterGoal, setWaterGoal] = useState(8);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSaveGoals = async () => {
    try {
      setLoading(true);
      setMessage("");

      const goalsToSave = [
        {
          type: "calories",
          target_value: calorieGoal,
          current_value: 0,
          deadline: null,
        },
        {
          type: "weight",
          target_value: weightGoal,
          current_value: 0,
          deadline: null,
        },
        {
          type: "water",
          target_value: waterGoal,
          current_value: 0,
          deadline: null,
        },
      ];

      for (const goal of goalsToSave) {
        const response = await fetch("/api/goals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(goal),
        });

        if (!response.ok) {
          throw new Error("Failed to save goals");
        }
      }

      setMessage("Goals saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while saving goals.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Your <span className="text-[#C8FF00]">targets</span>
          </h1>

          <p className="mt-1 text-sm text-white/40">
            Set your fitness targets and update them anytime as your progress
            changes.
          </p>
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
              <p className="text-sm text-white/40">Calories</p>
              <p className="mt-1 text-xl font-bold text-white">
                {calorieGoal}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/3 p-4">
              <p className="text-sm text-white/40">Weight</p>
              <p className="mt-1 text-xl font-bold text-white">
                {weightGoal} kg
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/3 p-4">
              <p className="text-sm text-white/40">Water</p>
              <p className="mt-1 text-xl font-bold text-white">
                {waterGoal} glasses
              </p>
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
          <p className="mt-4 text-center text-sm text-white/70">{message}</p>
        )}
      </main>
    </div>
  );
}