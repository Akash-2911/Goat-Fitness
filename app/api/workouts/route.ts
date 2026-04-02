import { createServerSupabaseClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

// GET — fetch all workouts for the logged in user
export async function GET() {
  const supabase = await createServerSupabaseClient()

  // Check user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  // Get all workouts for this user, newest first
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST — create a new workout
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()

  // Check user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  // Get the workout data from the request body
  const body = await request.json()
  const { title, duration_minutes, notes } = body

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  // Insert the workout into the database
  const { data, error } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      title,
      duration_minutes: duration_minutes || null,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}