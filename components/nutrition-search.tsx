"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Plus, CheckCircle } from "lucide-react"

export type FoodItem = {
  code: string
  product_name?: string
  brands?: string
  nutriments?: {
    "energy-kcal_100g"?: number
    proteins_100g?: number
    carbohydrates_100g?: number
    fat_100g?: number
  }
}

type NutritionSearchProps = {
  onSelectFood?: (food: FoodItem) => void
}

export default function NutritionSearch({ onSelectFood }: NutritionSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [addedItemCode, setAddedItemCode] = useState<string | null>(null)

  // useRef stores the timeout ID so we can clear it
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // This runs every time the query changes
  useEffect(() => {
    // Clear the previous timeout if user is still typing
    if (debounceRef.current) clearTimeout(debounceRef.current)

    // Don't search if less than 3 characters
    if (!query.trim() || query.trim().length < 3) {
      setResults([])
      return
    }

    // Wait 500ms after user stops typing before searching
    // This prevents too many API calls while typing
    debounceRef.current = setTimeout(() => {
      handleSearch()
    }, 500)

    // Cleanup timeout when component unmounts
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  async function handleSearch() {
    if (!query.trim()) return

    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        `/api/search-food?query=${encodeURIComponent(query)}`
      )

      const data = await response.json()

      if (!response.ok) throw new Error("Failed to fetch food results")

      setResults(data.products || [])
    } catch (err) {
      console.error(err)
      setError("Something went wrong while searching.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleAddFood(food: FoodItem) {
    onSelectFood?.(food)
    setAddedItemCode(food.code)
    setTimeout(() => setAddedItemCode(null), 2000)
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-[#111318] p-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C8FF00]">
        Nutrition search
      </p>
      <h2 className="mb-4 text-2xl font-black tracking-tighter text-white">
        Search food items
      </h2>

      {/* Search input — no button needed, searches automatically */}
      <div className="mb-6 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="w-4 h-4 text-white/30" />
        </div>
        <input
          type="text"
          placeholder="Type to search food... (e.g. eggs, chicken)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#C8FF00]/50 transition-colors"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#C8FF00]/30 border-t-[#C8FF00] rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Helper text */}
      {query.length > 0 && query.length < 3 && (
        <p className="text-white/30 text-sm mb-4">
          Type at least 3 characters to search...
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* No results */}
      {!loading && query.length >= 3 && results.length === 0 && !error && (
        <p className="text-white/30 text-sm text-center py-4">
          No results found for &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Results */}
      <div className="space-y-3">
        {results.map((food) => (
          <div
            key={food.code}
            className="rounded-xl border border-white/5 bg-white/3 p-4 hover:border-[#C8FF00]/20 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">
                  {food.product_name || "Unnamed product"}
                </p>
                <p className="text-xs text-white/30 mt-0.5">
                  {food.brands || "Unknown brand"}
                </p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="text-xs text-white/50">
                    <span className="text-[#C8FF00] font-semibold">
                      {Math.round(food.nutriments?.["energy-kcal_100g"] ?? 0)}
                    </span>{" "}
                    kcal
                  </span>
                  <span className="text-xs text-white/50">
                    P: {Math.round(food.nutriments?.proteins_100g ?? 0)}g
                  </span>
                  <span className="text-xs text-white/50">
                    C: {Math.round(food.nutriments?.carbohydrates_100g ?? 0)}g
                  </span>
                  <span className="text-xs text-white/50">
                    F: {Math.round(food.nutriments?.fat_100g ?? 0)}g
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAddFood(food)}
                className="shrink-0 bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20 rounded-lg p-2 hover:bg-[#C8FF00]/20 transition-colors"
              >
                {addedItemCode === food.code
                  ? <CheckCircle className="w-4 h-4 text-green-400" />
                  : <Plus className="w-4 h-4" />
                }
              </button>
            </div>

            {addedItemCode === food.code && (
              <p className="text-xs text-green-400 mt-2">Added to log!</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}