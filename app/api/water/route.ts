import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createClient();

    // get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // fetch user's water logs
    const { data, error } = await supabase
      .from("water_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false });

    if (error) {
      console.error("GET /api/water error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/water unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { glasses, daily_goal } = body;

    if (glasses === undefined) {
      return NextResponse.json(
        { error: "glasses value is required" },
        { status: 400 }
      );
    }

    // insert new water log
    const { data, error } = await supabase
      .from("water_logs")
      .insert([
        {
          user_id: user.id,
          glasses,
          daily_goal: daily_goal ?? 8,
          logged_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("POST /api/water error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/water unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}