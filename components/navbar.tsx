"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Activity, Droplets, Target, TrendingUp, Users, LayoutDashboard, LogOut, User, Flag } from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/workout", label: "Workout", icon: Activity },
    { href: "/nutrition", label: "Nutrition", icon: Target },
    { href: "/water", label: "Water", icon: Droplets },
    { href: "/progress", label: "Progress", icon: TrendingUp },
    { href: "/social", label: "Social", icon: Users },
     { href: "/goals", label: "Goals", icon: Flag },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/dashboard" className="text-xl font-black tracking-tighter">
          GOAT<span className="text-[#C8FF00]">.</span>
        </Link>

        {/* Nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
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

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Log out</span>
        </button>

      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111318] border-t border-white/5 flex justify-around py-2 z-50">
        {links.map((link) => {
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
    </nav>
  )
}