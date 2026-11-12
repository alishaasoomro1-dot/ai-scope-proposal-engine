import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 "proxy" (formerly middleware): cheap cookie gate; real checks happen in requireUser().
export function proxy(req: NextRequest) {
  if (!req.cookies.get("session")) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*"] };
