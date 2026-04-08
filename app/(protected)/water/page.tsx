"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";

export default function WaterPage() {
  const [glasses, setGlasses] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [loading, setLoading] = useState(false);

  // load saved water logs
  useEffect(() => {
    const fetchWater = async () => {
      try {
        const res = await fetch("/api/water");

        if (!res.ok) {
          throw new Error("Failed to load water data");
        }

        const data = await res.json();

        if (data.length > 0) {
          setGlasses(data[0].glasses);
          setDailyGoal(data[0].daily_goal);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchWater();
  }, []);

  // add glass
  const addGlass = async () => {
    try {
      setLoading(true);

      const newValue = glasses + 1;

      const res = await fetch("/api/water", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          glasses: newValue,
          daily_goal: dailyGoal,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save water log");
      }

      setGlasses(newValue);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // remove glass
  const removeGlass = async () => {
    if (glasses === 0) return;

    try {
      setLoading(true);

      const newValue = glasses - 1;

      const res = await fetch("/api/water", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          glasses: newValue,
          daily_goal: dailyGoal,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update water log");
      }

      setGlasses(newValue);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.min((glasses / dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Water <span className="text-[#C8FF00]">tracker</span>
          </h1>

          <p className="text-white/40 text-sm mt-1">
            Track your hydration and reach your daily goal.
          </p>
        </div>

        {/* Progress card */}
        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-4">Daily progress</h2>

          <p className="text-xl font-bold mb-4">
            {glasses} / {dailyGoal} glasses
          </p>

          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#C8FF00] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-3 text-white/40 text-sm">
            Keep going and hit your hydration goal.
          </p>
        </div>

        {/* Actions */}
        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6">
          <h2 className="font-bold mb-4">Log water</h2>

          <div className="flex gap-4">
            <button
              onClick={addGlass}
              disabled={loading}
              className="flex-1 bg-[#C8FF00] text-black font-bold py-3 rounded-full hover:bg-[#d4ff33]"
            >
              +1 Glass
            </button>

            <button
              onClick={removeGlass}
              disabled={loading}
              className="flex-1 border border-white/20 text-white font-bold py-3 rounded-full hover:bg-white/10"
            >
              -1 Glass
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}