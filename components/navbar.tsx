"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase"
import {
  Activity, Droplets, Target, TrendingUp,
  Users, LayoutDashboard, LogOut, User,
  Flag, MoreHorizontal
} from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  // Main links shown in the middle
  const mainLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/workout", label: "Workout", icon: Activity },
    { href: "/nutrition", label: "Nutrition", icon: Target },
    { href: "/water", label: "Water", icon: Droplets },
  ]

  // Extra links hidden in the 3-dot dropdown
  const moreLinks = [
    { href: "/progress", label: "Progress", icon: TrendingUp },
    { href: "/social", label: "Social", icon: Users },
    { href: "/goals", label: "Goals", icon: Flag },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo — left */}
        <Link href="/dashboard" className="text-xl font-black tracking-tighter shrink-0">
          GOAT<span className="text-[#C8FF00]">.</span>
        </Link>

        {/* Main links — center (desktop only) */}
        <div className="hidden md:flex items-center gap-1">
          {mainLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#C8FF00]/10 text-[#C8FF00]"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right side — 3-dot menu + logout */}
        <div className="hidden md:flex items-center gap-2">

          {/* 3-dot dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                moreLinks.some(l => l.href === pathname)
                  ? "bg-[#C8FF00]/10 text-[#C8FF00]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-[#111318] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                {moreLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? "bg-[#C8FF00]/10 text-[#C8FF00]"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>

        {/* Mobile — just logout button on top right */}
        <button
          onClick={handleLogout}
          className="md:hidden flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
        >
          <LogOut className="w-4 h-4" />
        </button>

      </div>

      {/* Mobile bottom nav — 5 key links */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111318] border-t border-white/5 z-50">
        <div className="flex justify-around py-2">
          {[
            { href: "/dashboard", label: "Home", icon: LayoutDashboard },
            { href: "/workout", label: "Workout", icon: Activity },
            { href: "/nutrition", label: "Nutrition", icon: Target },
            { href: "/water", label: "Water", icon: Droplets },
            { href: "/profile", label: "Profile", icon: User },
          ].map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors ${
                  isActive ? "text-[#C8FF00]" : "text-white/40"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

    </nav>
  )
}