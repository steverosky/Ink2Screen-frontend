import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization")
  const secret = process.env.REVALIDATE_SECRET

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Revalidate all pages — root layout wraps every route
  revalidatePath("/", "layout")
  return NextResponse.json({ revalidated: true, timestamp: Date.now() })
}
