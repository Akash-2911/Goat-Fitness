import { createServerSupabaseClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

// GET — fetch a single workout with its exercises
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()

  // Check user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  // Get the workout by ID
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (workoutError) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 })
  }

  // Get all exercises for this workout
  const { data: exercises, error: exercisesError } = await supabase
    .from("exercises")
    .select("*")
    .eq("workout_id", params.id)

  if (exercisesError) {
    return NextResponse.json({ error: exercisesError.message }, { status: 500 })
  }

  // Return workout and its exercises together
  return NextResponse.json({ ...workout, exercises })
}

// PUT — update a workout title, duration, or notes
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()

  // Check user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const body = await request.json()
  const { title, duration_minutes, notes } = body

  // Update the workout — only if it belongs to this user
  const { data, error } = await supabase
    .from("workouts")
    .update({ title, duration_minutes, notes })
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE — delete a workout and all its exercises
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()

  // Check user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  // Delete the workout — exercises delete automatically because of cascade
  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Workout deleted" })
}