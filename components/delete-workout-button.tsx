"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

export function DeleteWorkoutButton({ workoutId }: { workoutId: string }) {
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true)
      return
    }

    setDeleting(true)

    const response = await fetch(`/api/workouts/${workoutId}`, {
      method: "DELETE",
    })

    if (response.ok) {
      router.push("/dashboard")
    } else {
      setDeleting(false)
      setConfirm(false)
      alert("Failed to delete workout. Try again.")
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors ${
        confirm
          ? "bg-red-500/20 text-red-400 border border-red-500/20"
          : "text-white/30 hover:text-red-400 hover:bg-red-500/10"
      }`}
    >
      <Trash2 className="w-4 h-4" />
      {deleting ? "Deleting..." : confirm ? "Confirm delete" : "Delete"}
    </button>
  )
}