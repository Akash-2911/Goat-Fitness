// app/(protected)/social/page.tsx

"use client"; // Runs in the browser

import { useEffect, useState } from "react";

// Describes what one workout item in the feed looks like
interface FeedItem {
  id: string;
  title: string;
  duration_minutes: number;
  notes: string | null;
  logged_at: string;
  users: {
    full_name: string;
    avatar_url: string | null;
  };
}

export default function SocialPage() {
  // Stores the list of feed items
  const [feed, setFeed] = useState<FeedItem[]>([]);
  // True while waiting for data
  const [loading, setLoading] = useState(true);
  // Stores any error message
  const [error, setError] = useState("");

  // Runs once when page first loads
  useEffect(() => {
    fetch("/api/social/feed")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setFeed(data.feed);
        }
      })
      .catch(() => setError("Failed to load feed. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  // Turns "2024-03-15T10:30:00Z" into "March 15, 2024"
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Gets first letter of a name for the avatar circle
  function getInitial(name: string) {
    return name ? name[0].toUpperCase() : "?";
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Page header */}
        <p className="text-[#C8FF00] text-sm font-semibold uppercase tracking-widest mb-2">
          Social
        </p>
        <h1 className="text-4xl font-black tracking-tighter mb-2">
          Friend Activity
        </h1>
        <p className="text-white/50 mb-8">
          See what your friends have been up to
        </p>

        {/* Loading state — shown while fetching */}
        {loading && (
          <div className="text-center py-20 text-white/50">
            Loading feed...
          </div>
        )}

        {/* Error state — shown if fetch fails */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 mb-4">
            {error}
          </div>
        )}

        {/* Empty state — shown if they follow nobody yet */}
        {!loading && !error && feed.length === 0 && (
          <div className="bg-[#111318] border border-white/8 rounded-2xl p-12 text-center">
            <p className="text-4xl mb-4">👥</p>
            <p className="font-bold text-lg mb-2">No activity yet</p>
            <p className="text-white/50">
              Follow some friends to see their workouts here.
            </p>
          </div>
        )}

        {/* Feed list — shown when data loads successfully */}
        <div className="space-y-4">
          {feed.map((item) => (
            <div
              key={item.id}
              className="bg-[#111318] border border-white/8 rounded-2xl p-6"
            >
              {/* Friend avatar and name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#C8FF00]/20 flex items-center justify-center text-[#C8FF00] font-black text-sm flex-shrink-0">
                  {getInitial(item.users.full_name)}
                </div>
                <div>
                  <p className="font-bold">{item.users.full_name}</p>
                  <p className="text-white/40 text-xs">
                    {formatDate(item.logged_at)}
                  </p>
                </div>
              </div>

              {/* Workout details */}
              <p className="text-white/60 text-sm mb-1">logged a workout</p>
              <p className="font-black text-lg tracking-tight mb-1">
                {item.title}
              </p>
              <p className="text-[#C8FF00] text-sm font-semibold">
                {item.duration_minutes} minutes
              </p>

              {/* Optional notes */}
              {item.notes && (
                <p className="text-white/50 text-sm mt-2 italic">
                  &ldquo;{item.notes}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}