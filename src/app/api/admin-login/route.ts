import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "cyril.iriebi@gmail.com";
const ADMIN_PASSWORD = "jjbMMA200587@";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin", "ok", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 8
    });
    return res;
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
} 