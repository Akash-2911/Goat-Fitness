"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import NutritionSearch, { FoodItem } from "@/components/nutrition-search";

export default function NutritionPage() {
  const [dailyLog, setDailyLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // load saved nutrition logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/nutrition");

        if (!res.ok) {
          throw new Error("Failed to load nutrition logs");
        }

        const data = await res.json();
        setDailyLog(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLogs();
  }, []);

  // add food to DB
  const handleSelectFood = async (food: FoodItem) => {
    try {
      setLoading(true);

      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          food_name: food.product_name,
          calories: food.nutriments?.["energy-kcal_100g"],
          protein_g: food.nutriments?.proteins_100g,
          carbs_g: food.nutriments?.carbohydrates_100g,
          fat_g: food.nutriments?.fat_100g,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add food");
      }

      const newItem = await res.json();

      setDailyLog((prev) => [newItem, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // delete food
  const handleRemoveFood = async (id: string) => {
    try {
      const res = await fetch(`/api/nutrition/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setDailyLog((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalCalories = dailyLog.reduce(
    (total, food) => total + (food.calories ?? 0),
    0
  );

  const totalProtein = dailyLog.reduce(
    (total, food) => total + (food.protein_g ?? 0),
    0
  );

  const totalCarbs = dailyLog.reduce(
    (total, food) => total + (food.carbs_g ?? 0),
    0
  );

  const totalFat = dailyLog.reduce(
    (total, food) => total + (food.fat_g ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Nutrition <span className="text-[#C8FF00]">tracker</span>
          </h1>

          <p className="text-white/40 text-sm mt-1">
            Search foods and track your daily intake.
          </p>
        </div>

        <NutritionSearch onSelectFood={handleSelectFood} />

        {/* summary */}
        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mt-6">
          <h2 className="font-bold mb-4 text-white">Daily summary</h2>

          <p className="text-white">Calories: {totalCalories}</p>
          <p className="text-white">Protein: {totalProtein}g</p>
          <p className="text-white">Carbs: {totalCarbs}g</p>
          <p className="text-white">Fat: {totalFat}g</p>
        </div>

        {/* log list */}
        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mt-6">
          <h2 className="font-bold mb-4 text-white">Today's food log</h2>

          {dailyLog.length === 0 ? (
            <p className="text-white/40 text-sm">No food logged yet.</p>
          ) : (
            dailyLog.map((food) => (
              <div
                key={food.id}
                className="flex justify-between items-center border-b border-white/10 py-3"
              >
                <div>
                  <p className="text-white">{food.food_name}</p>
                  <p className="text-xs text-white/40">
                    {food.calories} kcal
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveFood(food.id)}
                  className="text-red-400 text-sm"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}