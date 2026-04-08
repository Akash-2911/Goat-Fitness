import { createClient as createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { Activity, Clock, ArrowLeft, Trash2 } from "lucide-react"

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createServerSupabaseClient()

  // Check user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Get the workout
  const { id } = await params

const { data: workout, error } = await supabase
  .from("workouts")
  .select("*")
  .eq("id", id)
  .eq("user_id", user.id)
  .single()
  // If workout not found redirect to workout page
  if (error || !workout) redirect("/workout")

  // Get all exercises for this workout
const { data: exercises } = await supabase
  .from("exercises")
  .select("*")
  .eq("workout_id", id)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">

        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        {/* Workout header */}
        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tighter mb-2">
                {workout.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-white/40">
                {workout.duration_minutes && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {workout.duration_minutes} min
                  </span>
                )}
                <span>
                  {new Date(workout.logged_at).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {workout.notes && (
                <p className="text-white/40 text-sm mt-3 bg-white/3 rounded-lg px-3 py-2">
                  {workout.notes}
                </p>
              )}
            </div>

            {/* Delete button */}
            <DeleteWorkoutButton workoutId={workout.id} />
          </div>
        </div>

        {/* Exercises list */}
        <div>
          <h2 className="text-lg font-bold mb-4">
            Exercises{" "}
            <span className="text-white/30 font-normal text-base">
              ({exercises?.length || 0})
            </span>
          </h2>

          {!exercises || exercises.length === 0 ? (
            <div className="bg-[#111318] border border-white/8 rounded-2xl p-8 text-center">
              <Activity className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No exercises logged.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-[#111318] border border-white/8 rounded-2xl p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#C8FF00]/10 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-[#C8FF00]" />
                    </div>
                    <h3 className="font-semibold capitalize">{exercise.name}</h3>
                  </div>

                  {/* Sets, reps, weight */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/3 rounded-xl p-3 text-center">
                      <div className="text-xl font-black text-[#C8FF00]">
                        {exercise.sets}
                      </div>
                      <div className="text-xs text-white/30 mt-0.5">Sets</div>
                    </div>
                    <div className="bg-white/3 rounded-xl p-3 text-center">
                      <div className="text-xl font-black text-[#C8FF00]">
                        {exercise.reps}
                      </div>
                      <div className="text-xs text-white/30 mt-0.5">Reps</div>
                    </div>
                    <div className="bg-white/3 rounded-xl p-3 text-center">
                      <div className="text-xl font-black text-[#C8FF00]">
                        {exercise.weight_kg || 0}
                      </div>
                      <div className="text-xs text-white/30 mt-0.5">kg</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}

// Delete button is a client component because it needs onClick
import { DeleteWorkoutButton } from "@/components/delete-workout-button"