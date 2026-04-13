"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase"
import {
  Share2, Copy,
  CheckCircle, MessageCircle, Activity,
  Droplets, Target, Zap, Trophy
} from "lucide-react"

type Workout = {
  id: string
  title: string
  duration_minutes: number | null
  logged_at: string
}

type Stats = {
  totalWorkouts: number
  totalCalories: number
  totalWater: number
  streak: number
}

export default function SocialPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [stats, setStats] = useState<Stats>({ totalWorkouts: 0, totalCalories: 0, totalWater: 0, streak: 0 })
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()
      setUserName(profile?.full_name || "GOAT athlete")

      // Get recent workouts
      const { data: workoutData } = await supabase
        .from("workouts")
        .select("id, title, duration_minutes, logged_at")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: false })
        .limit(5)
      setWorkouts(workoutData || [])

      // Get total workouts
      const { data: allWorkouts } = await supabase
        .from("workouts")
        .select("logged_at")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: false })

      // Get total calories
      const { data: nutrition } = await supabase
        .from("nutrition_logs")
        .select("calories")
        .eq("user_id", user.id)
      const totalCalories = nutrition?.reduce((sum, n) => sum + (n.calories || 0), 0) || 0

      // Get total water glasses
      const { data: water } = await supabase
        .from("water_logs")
        .select("glasses")
        .eq("user_id", user.id)
      const totalWater = water?.reduce((sum, w) => sum + (w.glasses || 0), 0) || 0

      // Calculate streak
      let streak = 0
      if (allWorkouts && allWorkouts.length > 0) {
        const uniqueDays = [...new Set(
          allWorkouts.map(w => new Date(w.logged_at).toISOString().split("T")[0])
        )]
        const todayDate = new Date()
        for (let i = 0; i < uniqueDays.length; i++) {
          const expected = new Date(todayDate)
          expected.setDate(expected.getDate() - i)
          if (uniqueDays[i] === expected.toISOString().split("T")[0]) {
            streak++
          } else break
        }
      }

      setStats({
        totalWorkouts: allWorkouts?.length || 0,
        totalCalories,
        totalWater,
        streak,
      })

      setLoading(false)
    }
    loadData()
  }, [])

  // Build share text for a specific workout
  function buildWorkoutShareText(workout: Workout) {
    return `💪 Just crushed "${workout.title}" on GOAT Fitness!\n\n` +
      `⏱ ${workout.duration_minutes ? `${workout.duration_minutes} min` : "Full session"}\n\n` +
      `Track your fitness journey 🐐\n` +
      `#GOATFitness #Fitness #Workout`
  }

  // Build share text for overall milestone stats
  function buildMilestoneShareText() {
    return `🏆 My GOAT Fitness milestones:\n\n` +
      `💪 ${stats.totalWorkouts} workouts completed\n` +
      `🔥 ${stats.streak} day streak\n` +
      `💧 ${stats.totalWater} glasses of water logged\n` +
      `🥗 ${stats.totalCalories} total calories tracked\n\n` +
      `Tracking my fitness journey on GOAT Fitness 🐐\n` +
      `#GOATFitness #Fitness #Health`
  }

  function openShare(platform: string, text: string) {
    const encoded = encodeURIComponent(text)
    const appUrl = encodeURIComponent("https://goat-fitness-iota.vercel.app")
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encoded}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${appUrl}&quote=${encoded}`,
      whatsapp: `https://wa.me/?text=${encoded}`,
    }
    window.open(urls[platform], "_blank", "width=600,height=400")
  }

  async function handleCopy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      alert("Could not copy. Please copy manually.")
    }
  }

  // Reusable share buttons row
  function ShareButtons({ text, id }: { text: string; id: string }) {
    return (
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => openShare("whatsapp", text)}
          className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 hover:bg-green-500/20 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs text-green-400 font-medium">WhatsApp</span>
        </button>
        <button
          onClick={() => openShare("twitter", text)}
          className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 rounded-lg px-3 py-2 hover:bg-sky-500/20 transition-colors"
        >
          <span className="text-sky-400 font-black text-xs">𝕏</span>
          <span className="text-xs text-sky-400 font-medium">Twitter</span>
        </button>
        <button
          onClick={() => openShare("facebook", text)}
          className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 hover:bg-blue-500/20 transition-colors"
        >
          <span className="text-blue-400 font-black text-xs leading-none">f</span>
          <span className="text-xs text-blue-400 font-medium">Facebook</span>
        </button>
        <button
          onClick={() => handleCopy(text, id)}
          className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
        >
          {copiedId === id
            ? <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            : <Copy className="w-3.5 h-3.5 text-white/40" />
          }
          <span className={`text-xs font-medium ${copiedId === id ? "text-green-400" : "text-white/40"}`}>
            {copiedId === id ? "Copied!" : "Copy"}
          </span>
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-24">
          <p className="text-white/40 text-sm text-center pt-20">Loading your achievements...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#C8FF00] text-xs font-semibold uppercase tracking-widest mb-2">
            Social
          </p>
          <h1 className="text-3xl font-black tracking-tighter mb-1">
            Share your <span className="text-[#C8FF00]">achievements</span>
          </h1>
          <p className="text-white/40 text-sm">
            Share your workouts and milestones on social media
          </p>
        </div>

        {/* Overall milestone card */}
        <div className="bg-[#111318] border border-[#C8FF00]/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-[#C8FF00]" />
            </div>
            <div>
              <h2 className="font-bold text-sm">My milestones</h2>
              <p className="text-white/30 text-xs">Share your overall progress</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
            <div className="bg-white/3 rounded-xl p-3 text-center">
              <Activity className="w-4 h-4 text-[#C8FF00] mx-auto mb-1" />
              <div className="text-xl font-black text-[#C8FF00]">{stats.totalWorkouts}</div>
              <div className="text-xs text-white/30">Workouts</div>
            </div>
            <div className="bg-white/3 rounded-xl p-3 text-center">
              <Zap className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <div className="text-xl font-black text-orange-400">{stats.streak}</div>
              <div className="text-xs text-white/30">Day streak</div>
            </div>
            <div className="bg-white/3 rounded-xl p-3 text-center">
              <Droplets className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <div className="text-xl font-black text-sky-400">{stats.totalWater}</div>
              <div className="text-xs text-white/30">Glasses</div>
            </div>
            <div className="bg-white/3 rounded-xl p-3 text-center">
              <Target className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <div className="text-xl font-black text-green-400">{stats.totalCalories}</div>
              <div className="text-xs text-white/30">Calories</div>
            </div>
          </div>

          <ShareButtons text={buildMilestoneShareText()} id="milestone" />
        </div>

        {/* Recent workouts to share */}
        <div>
          <h2 className="text-lg font-bold mb-4">Share a workout</h2>

          {workouts.length === 0 ? (
            <div className="bg-[#111318] border border-white/8 rounded-2xl p-8 text-center">
              <Activity className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No workouts yet.</p>
              <a href="/workout" className="text-[#C8FF00] text-sm hover:underline mt-2 inline-block">
                Log your first workout
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-[#111318] border border-white/8 rounded-2xl p-5 hover:border-[#C8FF00]/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-[#C8FF00]/10 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-[#C8FF00]" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{workout.title}</p>
                      <p className="text-white/30 text-xs">
                        {workout.duration_minutes ? `${workout.duration_minutes} min · ` : ""}
                        {new Date(workout.logged_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Preview text */}
                  <div className="bg-white/3 rounded-lg px-3 py-2 mt-3 mb-1">
                    <p className="text-xs text-white/40 whitespace-pre-line leading-relaxed">
                      {buildWorkoutShareText(workout)}
                    </p>
                  </div>

                  <ShareButtons text={buildWorkoutShareText(workout)} id={workout.id} />
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}