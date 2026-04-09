import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createClient()

  // Get logged in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("nutrition_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()

  // Get logged in user from session — never trust user_id from frontend
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from("nutrition_logs")
    .insert([{
      user_id: user.id,
      food_name: body.food_name,
      calories: body.calories,
      protein_g: body.protein_g,
      carbs_g: body.carbs_g,
      fat_g: body.fat_g,
      logged_at: new Date().toISOString(),
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}