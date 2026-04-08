import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nutrition_logs")
    .select("*")
    .order("logged_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nutrition_logs")
    .insert([
      {
        user_id: body.user_id,
        food_name: body.food_name,
        calories: body.calories,
        protein_g: body.protein_g,
        carbs_g: body.carbs_g,
        fat_g: body.fat_g,
        logged_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}