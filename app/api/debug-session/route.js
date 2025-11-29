// app/api/debug-session/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/authconfig";  // adjust path if needed

export async function GET(request) {
  const session = await auth();

  return NextResponse.json({
    session: session ?? null
  });
}
