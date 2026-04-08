"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import ProgressChart from "@/components/progress-chart";

type ProgressItem = {
  date: string;
  calories: number;
  water: number;
  workouts: number;
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

          if (!grouped[date]) {
            grouped[date] = {
              date,
              calories: 0,
              water: 0,
              workouts: 0,
            };
          }

          grouped[date].calories += item.calories ?? 0;
        });

        // water aggregation
        waterData.forEach((item: any) => {
          const date = item.logged_at?.split("T")[0];

          if (!grouped[date]) {
            grouped[date] = {
              date,
              calories: 0,
              water: 0,
              workouts: 0,
            };
          }

          grouped[date].water += item.glasses ?? 0;
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

  const chartData = useMemo(() => {
    return progressData.map((item) => ({
      label: item.date.slice(5),
      calories: item.calories,
      water: item.water,
      workouts: item.workouts,
    }));
  }, [progressData]);

  const caloriesChartData = chartData.map((item) => ({
    label: item.label,
    value: item.calories,
  }));

  const waterChartData = chartData.map((item) => ({
    label: item.label,
    value: item.water,
  }));

  const workoutsChartData = chartData.map((item) => ({
    label: item.label,
    value: item.workouts,
  }));

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

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Your <span className="text-[#C8FF00]">progress</span>
          </h1>

          <p className="text-white/40 text-sm mt-1">
            Review your calories and hydration over time.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-4">Overview</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-white/3 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-white/40">Total calories</p>
              <p className="mt-1 text-xl font-bold">{totalCalories}</p>
            </div>

            <div className="bg-white/3 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-white/40">Total water</p>
              <p className="mt-1 text-xl font-bold">{totalWater}</p>
            </div>

            <div className="bg-white/3 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-white/40">Total workouts</p>
              <p className="mt-1 text-xl font-bold">{totalWorkouts}</p>
            </div>

            <div className="bg-white/3 border border-white/5 rounded-xl p-4">
              <p className="text-sm text-white/40">Active days</p>
              <p className="mt-1 text-xl font-bold">{activeDays}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        {loading ? (
          <div className="bg-[#111318] border border-white/8 rounded-2xl p-6">
            <p className="text-white/40 text-sm">Loading progress...</p>
          </div>
        ) : progressData.length === 0 ? (
          <div className="bg-[#111318] border border-white/8 rounded-2xl p-6">
            <p className="text-white/40 text-sm">No progress data yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <ProgressChart
              title="Calories over time"
              data={caloriesChartData}
            />

            <ProgressChart
              title="Water intake"
              data={waterChartData}
            />

            <ProgressChart
              title="Workouts completed"
              data={workoutsChartData}
            />
          </div>
        )}
      </main>
    </div>
  );
}