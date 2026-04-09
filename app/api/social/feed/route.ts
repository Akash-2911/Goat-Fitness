import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const { data: follows, error: followError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id)

  if (followError) {
    return NextResponse.json({ error: followError.message }, { status: 500 })
  }

  if (!follows || follows.length === 0) {
    return NextResponse.json({ feed: [] })
  }

  const followingIds = follows.map((f) => f.following_id)

  const { data: feed, error: feedError } = await supabase
    .from("workouts")
    .select(`
      id,
      title,
      duration_minutes,
      notes,
      logged_at,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .in("user_id", followingIds)
    .order("logged_at", { ascending: false })
    .limit(20)

  if (feedError) {
    return NextResponse.json({ error: feedError.message }, { status: 500 })
  }

  return NextResponse.json({ feed })
}