import { NextResponse } from "next/server";
import { isTokenExpired } from "@/lib/authenticate";

export async function proxy(request) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/", "/login", "/signup"];
  const isPublic = publicRoutes.includes(pathname);

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && (await isTokenExpired(token))) {
    const res = NextResponse.redirect(new URL("/", request.url));
    res.cookies.delete("access_token");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)).*)",
  ],
};
