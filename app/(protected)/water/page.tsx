"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/navbar";

type WaterLog = {
  id?: string;
  glasses: number;
  daily_goal?: number;
  logged_at: string;
};

export default function WaterPage() {
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchWater = async () => {
      try {
        const res = await fetch("/api/water");

        if (!res.ok) {
          throw new Error("Failed to load water data");
        }

        const data = await res.json();
        setWaterLogs(Array.isArray(data) ? data : []);

        if (Array.isArray(data) && data.length > 0 && data[0].daily_goal) {
          setDailyGoal(data[0].daily_goal);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchWater();
  }, []);

  const todayLogs = useMemo(() => {
    return waterLogs.filter(
      (item) => item.logged_at?.split("T")[0] === today
    );
  }, [waterLogs, today]);

  const glasses = todayLogs.reduce(
    (sum, item) => sum + (Number(item.glasses) || 0),
    0
  );

  const weeklyData = useMemo(() => {
    const days: { label: string; fullDate: string; glasses: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const fullDate = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { weekday: "short" });

      const totalForDay = waterLogs
        .filter((item) => item.logged_at?.split("T")[0] === fullDate)
        .reduce((sum, item) => sum + (Number(item.glasses) || 0), 0);

      days.push({
        label,
        fullDate,
        glasses: totalForDay,
      });
    }

    return days;
  }, [waterLogs]);

  const addGlass = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/water", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          glasses: 1,
          daily_goal: dailyGoal,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save water log");
      }

      const newLog = await res.json();
      setWaterLogs((prev) => [newLog, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeGlass = () => {
    if (glasses === 0) return;

    const todayIndexes: number[] = [];
    waterLogs.forEach((item, index) => {
      if (item.logged_at?.split("T")[0] === today) {
        todayIndexes.push(index);
      }
    });

    if (todayIndexes.length === 0) return;

    const updatedLogs = [...waterLogs];
    updatedLogs.splice(todayIndexes[0], 1);
    setWaterLogs(updatedLogs);
  };

  const progress = Math.min((glasses / dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Water <span className="text-[#C8FF00]">tracker</span>
          </h1>

          <p className="text-white/40 text-sm mt-1">
            Track your hydration and reach your daily goal.
          </p>
        </div>

        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-4 text-white">Daily progress</h2>

          <p className="text-xl font-bold mb-4 text-white">
            {glasses} / {dailyGoal} glasses
          </p>

          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#C8FF00] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-3 text-white/40 text-sm">
            This value resets automatically each day by showing only today’s water logs.
          </p>
        </div>

        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6">
          <h2 className="font-bold mb-4 text-white">Log water</h2>

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
              disabled={loading || glasses === 0}
              className="flex-1 border border-white/20 text-white font-bold py-3 rounded-full hover:bg-white/10 disabled:opacity-50"
            >
              -1 Glass
            </button>
          </div>

          <p className="mt-4 text-xs text-white/50">
            Each added glass is stored with today’s date, so the progress page can show daily hydration activity over time.
          </p>
        </div>

        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mt-6">
          <h2 className="font-bold mb-4 text-white">Weekly water summary</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weeklyData.map((day) => (
              <div
                key={day.fullDate}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold">{day.label}</p>
                  <p className="text-xs text-white/40">{day.fullDate}</p>
                </div>

                <p className="text-2xl font-bold text-[#C8FF00]">
                  {day.glasses}
                </p>

                <p className="text-sm text-white/50 mt-1">
                  {day.glasses === 1
                    ? "glass logged"
                    : `${day.glasses} glasses logged`}
                </p>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#C8FF00]"
                    style={{
                      width: `${Math.min((day.glasses / dailyGoal) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-white/50">
            These cards show how many glasses of water were logged for each day during the last 7 days.
          </p>
        </div>
      </main>
    </div>
  );
}