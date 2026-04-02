"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [resendMsg, setResendMsg] = useState("")

async function handleResend() {
  const supabase = createClient()
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  })
  if (!error) setResendMsg("Confirmation email sent! Check your inbox.")
}

  async function handleLogin() {
    setLoading(true)
    setError("")

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black tracking-tighter">
            GOAT<span className="text-[#C8FF00]">.</span>
          </Link>
          <p className="text-white/40 text-sm mt-2">Welcome back</p>
        </div>

        {/* Card */}
        <div className="bg-[#111318] border border-white/8 rounded-2xl p-8">
          <h1 className="text-xl font-bold mb-6">Log in to your account</h1>

          {/* Error message */}
{error && (
  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4">
    <p className="text-red-400 text-sm">{error}</p>
    {error.toLowerCase().includes("confirm") && (
      <button
        onClick={handleResend}
        className="text-[#C8FF00] text-sm hover:underline mt-2 block"
      >
        Resend confirmation email
      </button>
    )}
  </div>
)}

{/* Success message after resend */}
{resendMsg && (
  <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 mb-4">
    <p className="text-green-400 text-sm">{resendMsg}</p>
  </div>
)}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-white/60 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C8FF00]/50 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm text-white/60 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C8FF00]/50 transition-colors"
            />
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#C8FF00] text-black font-bold py-3 rounded-full hover:bg-[#d4ff33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {/* Sign up link */}
          <p className="text-center text-white/40 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#C8FF00] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}