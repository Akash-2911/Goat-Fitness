"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import StreakBadge from "@/components/streak-badge";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsOn, setNotificationsOn] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profile);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-white/50">Loading profile...</p>
      </main>
    );
  }

  const avatarLetter =
    profile?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "?";

  const planClass = profile?.is_pro
    ? "text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block bg-[#C8FF00] text-black"
    : "text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block bg-white/10 text-white/50";

  const planLabel = profile?.is_pro ? "PRO" : "FREE";

  const toggleClass = notificationsOn
    ? "relative w-12 h-6 rounded-full transition-colors duration-200 bg-[#C8FF00]"
    : "relative w-12 h-6 rounded-full transition-colors duration-200 bg-white/20";

  const dotClass = notificationsOn
    ? "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 translate-x-6"
    : "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 translate-x-0.5";

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">

        <p className="text-[#C8FF00] text-sm font-semibold uppercase tracking-widest mb-2">
          Account
        </p>

        <h1 className="text-4xl font-black tracking-tighter mb-8">
          Your Profile
        </h1>

        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mb-5 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#C8FF00]/20 flex items-center justify-center text-[#C8FF00] text-2xl font-black flex-shrink-0">
            {avatarLetter}
          </div>
          <div>
            <p className="font-black text-xl tracking-tighter">
              {profile?.full_name ?? "GOAT Member"}
            </p>
            <p className="text-white/50 text-sm">
              {user?.email}
            </p>
            <span className={planClass}>
              {planLabel}
            </span>
          </div>
        </div>

        <div className="mb-5">
          <StreakBadge streak={7} label="Day Streak" />
        </div>

        <div className="bg-[#111318] border border-white/8 rounded-2xl p-6 mb-5">
          <h2 className="font-black text-lg tracking-tighter mb-4">
            Settings
          </h2>

          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <p className="font-medium">Water Reminders</p>
              <p className="text-white/40 text-sm">
                Get notified to hit your daily water goal
              </p>
            </div>
            <button onClick={() => setNotificationsOn(!notificationsOn)} className={toggleClass}>
              <div className={dotClass} />
            </button>
          </div>

          {!profile?.is_pro && (
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">GOAT Pro</p>
                <p className="text-white/40 text-sm">
                  Unlock social features and badges
                </p>
              </div>
              <a href="/pricing" className="bg-[#C8FF00] text-black font-bold px-4 py-2 rounded-full text-sm hover:opacity-90 transition-opacity">
                Upgrade
              </a>
            </div>
          )}
        </div>

        <button onClick={handleSignOut} className="w-full border border-white/10 text-white/60 px-6 py-3 rounded-full font-bold hover:border-red-500/30 hover:text-red-400 transition-colors">
          Sign Out
        </button>

      </div>
    </main>
  );
}