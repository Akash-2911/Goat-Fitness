import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { Activity, Droplets, Target, Zap, Flame } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const today = new Date().toISOString().split("T")[0]

  const { data: workouts } = await supabase
    .from("workouts")
    .select("id")
    .eq("user_id", user.id)
    .gte("logged_at", today)

  const { data: nutrition } = await supabase
    .from("nutrition_logs")
    .select("calories")
    .eq("user_id", user.id)
    .gte("logged_at", today)

  const totalCalories = nutrition?.reduce(
    (sum, item) => sum + (item.calories || 0), 0
  ) || 0

  const { data: water } = await supabase
    .from("water_logs")
    .select("glasses")
    .eq("user_id", user.id)
    .gte("logged_at", today)

  const totalGlasses = water?.reduce(
    (sum, item) => sum + (item.glasses || 0), 0
  ) || 0

  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)

  const { data: recentWorkouts } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(5)

  // Calculate streak
  const { data: allWorkouts } = await supabase
    .from("workouts")
    .select("logged_at")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })

  let streak = 0
  if (allWorkouts && allWorkouts.length > 0) {
    const uniqueDays = [...new Set(
      allWorkouts.map(w => new Date(w.logged_at).toISOString().split("T")[0])
    )]
    const todayDate = new Date()
    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = new Date(todayDate)
      expected.setDate(expected.getDate() - i)
      const expectedStr = expected.toISOString().split("T")[0]
      if (uniqueDays[i] === expectedStr) {
        streak++
      } else {
        break
      }
    }
  }

  // Get goals for calorie and water targets
  const calorieGoal = goals?.find(g => g.type === "calories")?.target_value || 2000
  const waterGoal = goals?.find(g => g.type === "water")?.target_value || 8

  // Calculate percentages capped at 100%
  const caloriePercent = Math.min(Math.round((totalCalories / calorieGoal) * 100), 100)
  const waterPercent = Math.min(Math.round((totalGlasses / waterGoal) * 100), 100)

  // SVG ring math
  const circumference = 2 * Math.PI * 36
  const calorieDash = (caloriePercent / 100) * circumference
  const waterDash = (waterPercent / 100) * circumference

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

        {/* Calorie ring + Water ring + Streak */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          {/* Calorie ring */}
          <div className="bg-[#111318] border border-white/8 rounded-2xl p-5 flex items-center gap-5">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"/>
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="#C8FF00"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${calorieDash} ${circumference}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-[#C8FF00]">{caloriePercent}%</span>
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">{totalCalories}</div>
              <div className="text-xs text-white/40">of {calorieGoal} kcal</div>
              <div className="text-xs text-white/20 mt-1">Calories today</div>
            </div>
          </div>

          {/* Water ring */}
          <div className="bg-[#111318] border border-white/8 rounded-2xl p-5 flex items-center gap-5">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"/>
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${waterDash} ${circumference}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-sky-400">{waterPercent}%</span>
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">{totalGlasses}</div>
              <div className="text-xs text-white/40">of {waterGoal} glasses</div>
              <div className="text-xs text-white/20 mt-1">Water today</div>
            </div>
          </div>

          {/* Streak counter */}
          <div className="bg-[#111318] border border-white/8 rounded-2xl p-5 flex items-center gap-5">
            <div className="w-20 h-20 shrink-0 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{streak}</div>
              <div className="text-xs text-white/40">day streak</div>
              <div className="text-xs text-white/20 mt-1">
                {streak === 0 ? "Log a workout to start!" : streak >= 7 ? "You're on fire! 🔥" : "Keep it going!"}
              </div>
            </div>
          </div>

        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111318] border border-white/8 rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center mb-3">
              <Activity className="w-4 h-4 text-[#C8FF00]" />
            </div>
            <div className="text-2xl font-black text-[#C8FF00]">{workouts?.length || 0}</div>
            <div className="text-xs text-white/40 mt-1">Workouts today</div>
          </div>

          <div className="bg-[#111318] border border-white/8 rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center mb-3">
              <Target className="w-4 h-4 text-[#C8FF00]" />
            </div>
            <div className="text-2xl font-black text-[#C8FF00]">{totalCalories}</div>
            <div className="text-xs text-white/40 mt-1">Calories today</div>
          </div>

          <div className="bg-[#111318] border border-white/8 rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center mb-3">
              <Droplets className="w-4 h-4 text-[#C8FF00]" />
            </div>
            <div className="text-2xl font-black text-[#C8FF00]">{totalGlasses} / {waterGoal}</div>
            <div className="text-xs text-white/40 mt-1">Glasses of water</div>
          </div>

          <div className="bg-[#111318] border border-white/8 rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4 text-[#C8FF00]" />
            </div>
            <div className="text-2xl font-black text-[#C8FF00]">{goals?.length || 0}</div>
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
              <Link href="/workout" className="text-[#C8FF00] text-sm hover:underline mt-2 inline-block">
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
                        {workout.duration_minutes ? `${workout.duration_minutes} min` : "No duration"}{" "}
                        • {new Date(workout.logged_at).toLocaleDateString()}
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