"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Link from "next/link"
import StreakBadge from "@/components/streak-badge"
import { User, Bell, Zap } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notificationsOn, setNotificationsOn] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(profile)
      setLoading(false)
    }
    loadUser()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-white/40 text-sm">Loading profile...</p>
      </div>
    )
  }

  const avatarLetter =
    profile?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "?"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#C8FF00] text-xs font-semibold uppercase tracking-widest mb-2">
            Account
          </p>
          <h1 className="text-3xl font-black tracking-tighter">
            Your <span className="text-[#C8FF00]">profile</span>
          </h1>
        </div>

        {/* Avatar card */}
        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mb-4 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#C8FF00]/20 flex items-center justify-center text-[#C8FF00] text-2xl font-black flex-shrink-0">
            {avatarLetter}
          </div>
          <div>
            <p className="font-black text-xl tracking-tighter">
              {profile?.full_name ?? "GOAT Member"}
            </p>
            <p className="text-white/40 text-sm">{user?.email}</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
              profile?.is_pro
                ? "bg-[#C8FF00] text-black"
                : "bg-white/10 text-white/50"
            }`}>
              {profile?.is_pro ? "PRO" : "FREE"}
            </span>
          </div>
        </div>

        {/* Streak badge */}
        <div className="mb-4">
          <StreakBadge streak={7} label="Day Streak" />
        </div>

        {/* Settings card */}
        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mb-4">
          <h2 className="font-bold text-base mb-4">Settings</h2>

          {/* Water reminders toggle */}
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#C8FF00]/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-[#C8FF00]" />
              </div>
              <div>
                <p className="font-medium text-sm">Water reminders</p>
                <p className="text-white/30 text-xs">
                  Get notified to hit your daily water goal
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsOn(!notificationsOn)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                notificationsOn ? "bg-[#C8FF00]" : "bg-white/20"
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                notificationsOn ? "translate-x-5" : "translate-x-0.5"
              }`} />
            </button>
          </div>

          {/* Upgrade to pro */}
          {!profile?.is_pro && (
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C8FF00]/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#C8FF00]" />
                </div>
                <div>
                  <p className="font-medium text-sm">GOAT Pro</p>
                  <p className="text-white/30 text-xs">
                    Unlock all features and badges
                  </p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="bg-[#C8FF00] text-black font-bold px-4 py-2 rounded-full text-xs hover:bg-[#d4ff33] transition-colors"
              >
                Upgrade
              </Link>
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full border border-white/10 text-white/50 px-6 py-3 rounded-full font-medium text-sm hover:border-red-500/30 hover:text-red-400 transition-colors"
        >
          Sign out
        </button>

      </main>
    </div>
  )
}