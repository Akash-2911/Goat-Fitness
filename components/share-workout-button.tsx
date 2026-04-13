"use client"

import { useState } from "react"
import { Share2, Twitter, Facebook, Copy, CheckCircle, MessageCircle } from "lucide-react"

type Exercise = {
  id: string
  name: string
  sets: number
  reps: number
  weight_kg: number | null
}

type Workout = {
  id: string
  title: string
  duration_minutes: number | null
  notes: string | null
  logged_at: string
}

type Props = {
  workout: Workout
  exercises: Exercise[]
  userName: string
}

export function ShareWorkoutButton({ workout, exercises, userName }: Props) {
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Build the share message
  const exerciseList = exercises
    .slice(0, 3)
    .map((e) => `${e.name} (${e.sets}x${e.reps})`)
    .join(", ")

  const moreCount = exercises.length > 3 ? ` +${exercises.length - 3} more` : ""

  const shareText = `💪 Just crushed ${workout.title} on GOAT Fitness!\n\n` +
    `⏱ ${workout.duration_minutes ? `${workout.duration_minutes} min` : "Full session"}\n` +
    `🏋️ ${exerciseList}${moreCount}\n\n` +
    `Track your fitness journey on GOAT Fitness 🐐\n` +
    `#GOATFitness #Fitness #Workout`

  const encodedText = encodeURIComponent(shareText)
  const appUrl = encodeURIComponent("https://goat-fitness-iota.vercel.app")

  // Share URLs for each platform
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${appUrl}&quote=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}`,
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert("Could not copy. Please copy manually.")
    }
  }

  function openShare(url: string) {
    window.open(url, "_blank", "width=600,height=400")
  }

  return (
    <div className="bg-[#111318] border border-white/8 rounded-2xl p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center">
          <Share2 className="w-4 h-4 text-[#C8FF00]" />
        </div>
        <div>
          <h2 className="font-bold text-sm">Share this workout</h2>
          <p className="text-white/30 text-xs">Let your friends know what you accomplished</p>
        </div>
      </div>

      {/* Preview toggle */}
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="text-xs text-[#C8FF00] hover:underline mb-4 block"
      >
        {showPreview ? "Hide preview" : "Show what will be shared"}
      </button>

      {/* Share preview card */}
      {showPreview && (
        <div className="bg-[#0a0a0a] border border-[#C8FF00]/20 rounded-xl p-4 mb-4">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Preview</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#C8FF00]/20 flex items-center justify-center text-[#C8FF00] text-xs font-black">
              {userName[0]?.toUpperCase() || "G"}
            </div>
            <div>
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-white/30 text-xs">via GOAT Fitness 🐐</p>
            </div>
          </div>
          <p className="text-sm font-black text-[#C8FF00] mb-1">💪 {workout.title}</p>
          {workout.duration_minutes && (
            <p className="text-xs text-white/50 mb-1">⏱ {workout.duration_minutes} min</p>
          )}
          {exercises.length > 0 && (
            <p className="text-xs text-white/50 mb-2">
              🏋️ {exerciseList}{moreCount}
            </p>
          )}
          <p className="text-xs text-white/30">#GOATFitness #Fitness #Workout</p>
        </div>
      )}

      {/* Share buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

        {/* WhatsApp */}
        <button
          onClick={() => openShare(shareUrls.whatsapp)}
          className="flex flex-col items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-3 hover:bg-green-500/20 transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-green-400" />
          <span className="text-xs text-green-400 font-medium">WhatsApp</span>
        </button>

        {/* Twitter / X */}
        <button
          onClick={() => openShare(shareUrls.twitter)}
          className="flex flex-col items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-xl p-3 hover:bg-sky-500/20 transition-colors"
        >
          <Twitter className="w-5 h-5 text-sky-400" />
          <span className="text-xs text-sky-400 font-medium">Twitter / X</span>
        </button>

        {/* Facebook */}
        <button
          onClick={() => openShare(shareUrls.facebook)}
          className="flex flex-col items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 hover:bg-blue-500/20 transition-colors"
        >
          <Facebook className="w-5 h-5 text-blue-400" />
          <span className="text-xs text-blue-400 font-medium">Facebook</span>
        </button>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors"
        >
          {copied
            ? <CheckCircle className="w-5 h-5 text-green-400" />
            : <Copy className="w-5 h-5 text-white/50" />
          }
          <span className={`text-xs font-medium ${copied ? "text-green-400" : "text-white/50"}`}>
            {copied ? "Copied!" : "Copy text"}
          </span>
        </button>

      </div>
    </div>
  )
}