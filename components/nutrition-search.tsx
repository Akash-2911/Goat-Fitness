"use client";

import { useState } from "react";

export type FoodItem = {
  code: string;
  product_name?: string;
  brands?: string;
  nutriments?: {
    "energy-kcal_100g"?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
};

type NutritionSearchProps = {
  onSelectFood?: (food: FoodItem) => void;
};

export default function NutritionSearch({
  onSelectFood,
}: NutritionSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addedItemCode, setAddedItemCode] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      setResults([]);

      const response = await fetch(
        `/api/search-food?query=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch food results");
      }

      setResults(data.products || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while searching.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = (food: FoodItem) => {
    onSelectFood?.(food);

    setAddedItemCode(food.code);

    setTimeout(() => {
      setAddedItemCode(null);
    }, 2000);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111318] p-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#C8FF00]">
        Nutrition Search
      </p>

      <h2 className="mb-4 text-2xl font-black tracking-tighter text-white">
        Search food items
      </h2>

      {/* search input */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Search for food..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="
            flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white
            outline-none placeholder:text-white/40
            transition-all duration-200
            focus:border-[#C8FF00] focus:ring-2 focus:ring-[#C8FF00]
          "
        />

        <button
          onClick={handleSearch}
          className="
            rounded-full bg-[#C8FF00] px-6 py-3 font-bold text-black
            transition-all duration-200
            hover:scale-105 hover:bg-lime-300 hover:shadow-lg
            active:scale-95
          "
        >
          Search
        </button>
      </div>

      {/* loading */}
      {loading && <p className="text-white/70">Loading...</p>}

      {/* error */}
      {error && <p className="text-red-400">{error}</p>}

      {/* results */}
      <div className="space-y-3">
        {results.map((food) => (
          <div
            key={food.code}
            className="
              rounded-xl border border-white/10 bg-white/5 p-4
              transition-all duration-200 hover:bg-white/10
            "
          >
            <p className="font-semibold text-white">
              {food.product_name || "Unnamed product"}
            </p>

            <p className="mt-1 text-sm text-white/50">
              {food.brands || "Unknown brand"}
            </p>

            <div className="mt-2 text-sm text-white/70">
              <span className="mr-4">
                Calories: {food.nutriments?.["energy-kcal_100g"] ?? 0}
              </span>

              <span className="mr-4">
                Protein: {food.nutriments?.proteins_100g ?? 0}g
              </span>

              <span className="mr-4">
                Carbs: {food.nutriments?.carbohydrates_100g ?? 0}g
              </span>

              <span>
                Fat: {food.nutriments?.fat_100g ?? 0}g
              </span>
            </div>

            <button
              onClick={() => handleAddFood(food)}
              className="
                mt-4 rounded-full bg-[#C8FF00] px-4 py-2 text-sm font-bold text-black
                transition-all duration-200
                hover:scale-105 hover:bg-lime-300 hover:shadow-lg
                active:scale-95
              "
            >
              Add to log
            </button>

            {addedItemCode === food.code && (
              <p className="mt-2 text-sm text-green-400">
                ✅ Added successfully
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}