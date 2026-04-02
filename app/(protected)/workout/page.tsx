"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase"
import { Search, Plus, X, CheckCircle } from "lucide-react"

// This is what one exercise from ExerciseDB looks like
type Exercise = {
  id: string
  name: string
  bodyPart: string
  equipment: string
  target: string
}

// This is what one logged set looks like
type LoggedExercise = {
  name: string
  sets: number
  reps: number
  weight_kg: number
}

export default function WorkoutPage() {
  const router = useRouter()

  // Workout details
  const [title, setTitle] = useState("")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")

  // Exercise search
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Exercise[]>([])
  const [searching, setSearching] = useState(false)

  // List of exercises added to this workout
  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>([])

  // Save state
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  // Search ExerciseDB API
  async function handleSearch() {
    if (!searchQuery.trim()) return
    setSearching(true)
    console.log("API Key:", process.env.NEXT_PUBLIC_RAPIDAPI_KEY)  // add this line

    try {
      const response = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises/name/${searchQuery}?limit=6`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        }
      )
      const data = await response.json()
      setSearchResults(data)
    } catch {
      setError("Could not search exercises. Try again.")
    }

    setSearching(false)
  }

  // Add exercise to the workout list
  function addExercise(exercise: Exercise) {
    setLoggedExercises([
      ...loggedExercises,
      {
        name: exercise.name,
        sets: 3,
        reps: 10,
        weight_kg: 0,
      },
    ])
    setSearchResults([])
    setSearchQuery("")
  }

  // Remove exercise from the list
  function removeExercise(index: number) {
    setLoggedExercises(loggedExercises.filter((_, i) => i !== index))
  }

  // Update sets, reps, or weight for an exercise
  function updateExercise(index: number, field: keyof LoggedExercise, value: number) {
    const updated = [...loggedExercises]
    updated[index] = { ...updated[index], [field]: value }
    setLoggedExercises(updated)
  }

  // Save the full workout to Supabase
  async function handleSave() {
    if (!title.trim()) {
      setError("Please add a workout title.")
      return
    }
    if (loggedExercises.length === 0) {
      setError("Please add at least one exercise.")
      return
    }

    setSaving(true)
    setError("")

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    // Step 1 — Save the workout
    const { data: workout, error: workoutError } = await supabase
      .from("workouts")
      .insert({
        user_id: user.id,
        title,
        duration_minutes: duration ? parseInt(duration) : null,
        notes,
      })
      .select()
      .single()

    if (workoutError) {
      setError("Failed to save workout. Try again.")
      setSaving(false)
      return
    }

    // Step 2 — Save each exercise linked to the workout
    const exercisesToInsert = loggedExercises.map((ex) => ({
      workout_id: workout.id,
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      weight_kg: ex.weight_kg || null,
    }))

    const { error: exerciseError } = await supabase
      .from("exercises")
      .insert(exercisesToInsert)

    if (exerciseError) {
      setError("Workout saved but exercises failed. Try again.")
      setSaving(false)
      return
    }

    setSaved(true)
    setTimeout(() => router.push("/dashboard"), 1500)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter">
            Log <span className="text-[#C8FF00]">workout</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Search exercises, add sets and reps, then save.
          </p>
        </div>

        {/* Success message */}
        {saved && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <p className="text-green-400 text-sm">Workout saved! Redirecting...</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Workout details */}
        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-4">Workout details</h2>

          <div className="mb-4">
            <label className="block text-sm text-white/60 mb-2">
              Workout title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chest Day, Morning Run..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C8FF00]/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 45"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C8FF00]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Notes (optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did it feel?"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C8FF00]/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Exercise search */}
        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-4">Add exercises</h2>

          {/* Search bar */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search exercises e.g. bench press..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C8FF00]/50 transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="bg-[#C8FF00] text-black font-bold px-4 py-3 rounded-lg hover:bg-[#d4ff33] transition-colors disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Search results */}
          {searching && (
            <p className="text-white/40 text-sm text-center py-4">Searching...</p>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2 mb-4">
              {searchResults.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-medium capitalize">
                      {exercise.name}
                    </div>
                    <div className="text-xs text-white/30 capitalize mt-0.5">
                      {exercise.bodyPart} · {exercise.equipment}
                    </div>
                  </div>
                  <button
                    onClick={() => addExercise(exercise)}
                    className="bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20 rounded-lg p-1.5 hover:bg-[#C8FF00]/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Added exercises */}
          {loggedExercises.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 mb-3">
                Added exercises ({loggedExercises.length})
              </h3>
              <div className="space-y-3">
                {loggedExercises.map((ex, index) => (
                  <div
                    key={index}
                    className="bg-white/3 border border-white/5 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium capitalize">
                        {ex.name}
                      </span>
                      <button
                        onClick={() => removeExercise(index)}
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sets, reps, weight inputs */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-white/30 mb-1">Sets</label>
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => updateExercise(index, "sets", parseInt(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C8FF00]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/30 mb-1">Reps</label>
                        <input
                          type="number"
                          value={ex.reps}
                          onChange={(e) => updateExercise(index, "reps", parseInt(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C8FF00]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/30 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          value={ex.weight_kg}
                          onChange={(e) => updateExercise(index, "weight_kg", parseFloat(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C8FF00]/50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loggedExercises.length === 0 && searchResults.length === 0 && !searching && (
            <p className="text-white/20 text-sm text-center py-4">
              Search for exercises above to add them
            </p>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="w-full bg-[#C8FF00] text-black font-bold py-4 rounded-full hover:bg-[#d4ff33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save workout"}
        </button>

      </main>
    </div>
  )
}
