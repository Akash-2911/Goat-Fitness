"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { Users } from "lucide-react"

interface FeedItem {
  id: string
  title: string
  duration_minutes: number
  notes: string | null
  logged_at: string
  users: {
    full_name: string
    avatar_url: string | null
  }
}

export default function SocialPage() {
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/social/feed")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setFeed(data.feed || [])
        }
      })
      .catch(() => setError("Failed to load feed. Please refresh."))
      .finally(() => setLoading(false))
  }, [])

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  function getInitial(name: string) {
    return name ? name[0].toUpperCase() : "?"
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
            Friend <span className="text-[#C8FF00]">activity</span>
          </h1>
          <p className="text-white/40 text-sm">
            See what your friends have been up to
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-white/40 text-sm">
            Loading feed...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && feed.length === 0 && (
          <div className="bg-[#111318] border border-white/8 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-[#C8FF00]" />
            </div>
            <p className="font-bold text-lg mb-2">No activity yet</p>
            <p className="text-white/40 text-sm">
              Follow some friends to see their workouts here.
            </p>
          </div>
        )}

        {/* Feed */}
        <div className="space-y-4">
          {feed.map((item) => (
            <div
              key={item.id}
              className="bg-[#111318] border border-white/8 rounded-2xl p-6 hover:border-[#C8FF00]/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#C8FF00]/20 flex items-center justify-center text-[#C8FF00] font-black text-sm flex-shrink-0">
                  {getInitial((item as any).profiles?.full_name || "?")}
                </div>
                <div>
                 <p className="font-bold text-sm">{(item as any).profiles?.full_name || "Unknown"}</p>
                  <p className="text-white/30 text-xs">{formatDate(item.logged_at)}</p>
                </div>
              </div>

              <p className="text-white/40 text-xs mb-1">logged a workout</p>
              <p className="font-black text-lg tracking-tight mb-1">{item.title}</p>
              <p className="text-[#C8FF00] text-sm font-semibold">
                {item.duration_minutes} minutes
              </p>

              {item.notes && (
                <p className="text-white/40 text-sm mt-3 italic border-t border-white/5 pt-3">
                  &ldquo;{item.notes}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}