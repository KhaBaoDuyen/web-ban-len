import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/app/lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_session")?.value;
  const { pathname } = request.nextUrl;

   const publicPaths = ["/dang-nhap", "/api", "/_next", "/favicon.ico"];

  const isPublic = publicPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isPublic) {
    return NextResponse.next();
  }

   const protectedPaths = ["/quan-ly-san-pham", "/danh-sach-san-pham"];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/dang-nhap", request.url));
  }

  return NextResponse.next();
}
