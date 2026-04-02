import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { Activity, Droplets, Target, Zap } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Get today's date as string e.g. "2026-03-20"
  const today = new Date().toISOString().split("T")[0]

  // Count workouts logged today
  const { data: workouts } = await supabase
    .from("workouts")
    .select("id")
    .eq("user_id", user.id)
    .gte("logged_at", today)

  // Get nutrition logs for today and add up calories
  const { data: nutrition } = await supabase
    .from("nutrition_logs")
    .select("calories")
    .eq("user_id", user.id)
    .gte("logged_at", today)

  const totalCalories = nutrition?.reduce(
    (sum, item) => sum + (item.calories || 0), 0
  ) || 0

  // Get water logs for today and add up glasses
  const { data: water } = await supabase
    .from("water_logs")
    .select("glasses")
    .eq("user_id", user.id)
    .gte("logged_at", today)

  const totalGlasses = water?.reduce(
    (sum, item) => sum + (item.glasses || 0), 0
  ) || 0

  // Count active goals
  const { data: goals } = await supabase
    .from("goals")
    .select("id")
    .eq("user_id", user.id)

  // Get 5 most recent workouts
  const { data: recentWorkouts } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(5)

  // Get first name only for the greeting
  const firstName = profile?.full_name?.split(" ")[0] || "Athlete"

  const quickActions = [
    { label: "Log workout", href: "/workout", icon: Activity },
    { label: "Log food", href: "/nutrition", icon: Target },
    { label: "Log water", href: "/water", icon: Droplets },
    { label: "View progress", href: "/progress", icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">

        {/* Welcome header */}
        <div className="mb-8">
          <p className="text-white/40 text-sm mb-1">Good morning,</p>
          <h1 className="text-3xl font-black tracking-tighter">
            {firstName} <span className="text-[#C8FF00]">👋</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111318] border border-white/8 rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center mb-3">
              <Activity className="w-4 h-4 text-[#C8FF00]" />
            </div>
            <div className="text-2xl font-black text-[#C8FF00]">
              {workouts?.length || 0}
            </div>
            <div className="text-xs text-white/40 mt-1">Workouts today</div>
          </div>

          <div className="bg-[#111318] border border-white/8 rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center mb-3">
              <Target className="w-4 h-4 text-[#C8FF00]" />
            </div>
            <div className="text-2xl font-black text-[#C8FF00]">
              {totalCalories}
            </div>
            <div className="text-xs text-white/40 mt-1">Calories today</div>
          </div>

          <div className="bg-[#111318] border border-white/8 rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center mb-3">
              <Droplets className="w-4 h-4 text-[#C8FF00]" />
            </div>
            <div className="text-2xl font-black text-[#C8FF00]">
              {totalGlasses} / 8
            </div>
            <div className="text-xs text-white/40 mt-1">Glasses of water</div>
          </div>

          <div className="bg-[#111318] border border-white/8 rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4 text-[#C8FF00]" />
            </div>
            <div className="text-2xl font-black text-[#C8FF00]">
              {goals?.length || 0}
            </div>
            <div className="text-xs text-white/40 mt-1">Active goals</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="bg-[#111318] border border-white/8 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-[#C8FF00]/30 hover:bg-white/5 transition-all text-center"
              >
                <action.icon className="w-5 h-5 text-[#C8FF00]" />
                <span className="text-xs text-white/60">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent workouts */}
        <div>
          <h2 className="text-lg font-bold mb-4">Recent workouts</h2>

          {!recentWorkouts || recentWorkouts.length === 0 ? (
            <div className="bg-[#111318] border border-white/8 rounded-2xl p-8 text-center">
              <Activity className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No workouts yet.</p>
              <Link
                href="/workout"
                className="text-[#C8FF00] text-sm hover:underline mt-2 inline-block"
              >
                Log your first workout
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentWorkouts.map((workout) => (
                <Link
                  key={workout.id}
                  href={`/workout/${workout.id}`}
                  className="bg-[#111318] border border-white/8 rounded-2xl p-4 flex items-center justify-between hover:border-[#C8FF00]/20 transition-all block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-[#C8FF00]" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{workout.title}</div>
                      <div className="text-xs text-white/30">
                        {workout.duration_minutes
                          ? `${workout.duration_minutes} min`
                          : "No duration"}{" "}
                        •{" "}
                        {new Date(workout.logged_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-white/20 text-xs">View →</div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}