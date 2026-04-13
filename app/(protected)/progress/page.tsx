"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/navbar";

type ProgressItem = {
  date: string;
  calories: number;
  water: number;
  workouts: number;
};

type WeeklyRow = {
  label: string;
  fullDate: string;
  calories: number;
  water: number;
  workouts: number;
  status: string;
};

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const nutritionRes = await fetch("/api/nutrition");
        const waterRes = await fetch("/api/water");

        const nutritionData = nutritionRes.ok
          ? await nutritionRes.json()
          : [];

        const waterData = waterRes.ok
          ? await waterRes.json()
          : [];

        const grouped: Record<string, ProgressItem> = {};

        // nutrition aggregation
        nutritionData.forEach((item: any) => {
          const date = item.logged_at?.split("T")[0];
          if (!date) return;

          if (!grouped[date]) {
            grouped[date] = {
              date,
              calories: 0,
              water: 0,
              workouts: 0,
            };
          }

          grouped[date].calories += Number(item.calories ?? 0);
        });

        // water aggregation
        waterData.forEach((item: any) => {
          const date = item.logged_at?.split("T")[0];
          if (!date) return;

          if (!grouped[date]) {
            grouped[date] = {
              date,
              calories: 0,
              water: 0,
              workouts: 0,
            };
          }

          grouped[date].water += Number(item.glasses ?? 0);
        });

        const sorted = Object.values(grouped).sort((a, b) =>
          a.date.localeCompare(b.date)
        );

        setProgressData(sorted);
      } catch (err) {
        console.error("Progress load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const totalCalories = progressData.reduce(
    (sum, item) => sum + item.calories,
    0
  );

  const totalWater = progressData.reduce(
    (sum, item) => sum + item.water,
    0
  );

  const totalWorkouts = progressData.reduce(
    (sum, item) => sum + item.workouts,
    0
  );

  const activeDays = progressData.length;

  const weeklyData = useMemo(() => {
    const rows: WeeklyRow[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const fullDate = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { weekday: "short" });

      const found = progressData.find((item) => item.date === fullDate);

      const calories = found?.calories ?? 0;
      const water = found?.water ?? 0;
      const workouts = found?.workouts ?? 0;

      let completedGoals = 0;

      if (calories >= 2500) completedGoals++;
      if (water >= 8) completedGoals++;
      if (workouts >= 1) completedGoals++;

      let status = "No activity";

      if (completedGoals === 3) {
        status = "Goal reached";
      } else if (completedGoals === 2) {
        status = "Great progress";
      } else if (completedGoals === 1) {
        status = "Good start";
      }

      rows.push({
        label,
        fullDate,
        calories,
        water,
        workouts,
        status,
      });
    }

    return rows;
  }, [progressData]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Your <span className="text-[#C8FF00]">progress</span>
          </h1>

          <p className="text-white/40 text-sm mt-1">
            Review your weekly calories, hydration, and activity in one place.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-4 text-white">Overview</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-white/3 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-white/40">Total calories</p>
              <p className="mt-1 text-xl font-bold text-white">
                {totalCalories}
              </p>
              <p className="mt-1 text-xs text-white/50">
                Calculated by summing all calories recorded from nutrition logs across tracked days.
              </p>
            </div>

            <div className="bg-white/3 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-white/40">Total water</p>
              <p className="mt-1 text-xl font-bold text-white">
                {totalWater}
              </p>
              <p className="mt-1 text-xs text-white/50">
                Shows the total number of glasses logged from hydration activity.
              </p>
            </div>

            <div className="bg-white/3 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-white/40">Total workouts</p>
              <p className="mt-1 text-xl font-bold text-white">
                {totalWorkouts}
              </p>
              <p className="mt-1 text-xs text-white/50">
                Counts all workouts completed and stored during the selected tracking period.
              </p>
            </div>

            <div className="bg-white/3 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-white/40">Active days</p>
              <p className="mt-1 text-xl font-bold text-white">
                {activeDays}
              </p>
              <p className="mt-1 text-xs text-white/50">
                Represents the number of days where nutrition or hydration activity was recorded.
              </p>
            </div>
          </div>
        </div>

        {/* Weekly interactive table */}
        {loading ? (
          <div className="bg-[#111318] border border-white/8 rounded-2xl p-6">
            <p className="text-white/40 text-sm">Loading weekly progress...</p>
          </div>
        ) : (
          <div className="bg-[#111318] border border-white/8 rounded-2xl p-6">
            <div className="mb-4">
              <h2 className="font-bold text-white">Weekly progress table</h2>
              <p className="mt-1 text-sm text-white/40">
                This table updates daily and shows your recorded activity for the last 7 days.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-sm text-white/50">
                    <th className="py-3 pr-4">Day</th>
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 pr-4">Calories</th>
                    <th className="py-3 pr-4">Water</th>
                    <th className="py-3 pr-4">Workouts</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {weeklyData.map((day) => (
                    <tr
                      key={day.fullDate}
                      className="border-b border-white/5 transition hover:bg-white/5"
                    >
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-white">{day.label}</p>
                      </td>

                      <td className="py-4 pr-4 text-white/60">
                        {day.fullDate}
                      </td>

                      <td className="py-4 pr-4">
                        <div className="space-y-2">
                          <p className="font-medium text-white">
                            {day.calories}
                          </p>
                          <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-[#C8FF00]"
                              style={{
                                width: `${Math.min((day.calories / 2500) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-4 pr-4">
                        <div className="space-y-2">
                          <p className="font-medium text-white">{day.water}</p>
                          <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-[#C8FF00]"
                              style={{
                                width: `${Math.min((day.water / 8) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-4 pr-4">
                        <div className="space-y-2">
                          <p className="font-medium text-white">
                            {day.workouts}
                          </p>
                          <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-[#C8FF00]"
                              style={{
                                width: `${Math.min((day.workouts / 1) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            day.status === "Goal reached"
                              ? "bg-[#C8FF00]/15 text-[#C8FF00]"
                              : day.status === "Great progress"
                              ? "bg-blue-500/15 text-blue-300"
                              : day.status === "Good start"
                              ? "bg-yellow-500/15 text-yellow-300"
                              : "bg-white/5 text-white/50"
                          }`}
                        >
                          {day.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-white/50">
              Water is measured from hydration logs, calories come from nutrition logs, and the status changes automatically based on recorded activity.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}