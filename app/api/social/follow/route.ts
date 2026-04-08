
import { NextRequest, NextResponse } from "next/server";
import { createBrowserClient } from "@supabase/ssr"; // ← same fix

export async function POST(req: NextRequest) {

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not logged in" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { following_id } = body;

  if (!following_id) {
    return NextResponse.json(
      { error: "Missing following_id" },
      { status: 400 }
    );
  }

  if (following_id === user.id) {
    return NextResponse.json(
      { error: "Cannot follow yourself" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("follows").insert({
    follower_id: user.id,
    following_id: following_id,
  });

  if (error) {
    
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Already following" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "Now following!" });
}