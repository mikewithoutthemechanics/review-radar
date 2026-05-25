import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const CSRF_HEADER = "x-csrf-token";
const CSRF_COOKIE = "csrf-token";

export function generateCSRFToken(): string {
  return createHash("sha256")
    .update(Date.now().toString() + Math.random().toString())
    .digest("hex")
    .substring(0, 32);
}

export function verifyCSRFToken(request: NextRequest): boolean {
  const headerToken = request.headers.get(CSRF_HEADER);
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;

  if (!headerToken || !cookieToken) return false;

  return headerToken === cookieToken && headerToken.length === 32;
}

export function withCSRFProtection(request: NextRequest): {
  allowed: boolean;
  token: string;
  response?: NextResponse;
} {
  const method = request.method.toUpperCase();

  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    const token = generateCSRFToken();
    const response = NextResponse.next();
    response.cookies.set(CSRF_COOKIE, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
    });
    return { allowed: true, token, response };
  }

  if (!verifyCSRFToken(request)) {
    return { allowed: false, token: "" };
  }

  return { allowed: true, token: "" };
}

export function addCSRFTokenToResponse(
  response: NextResponse,
  token: string
): NextResponse {
  response.cookies.set(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600,
  });
  return response;
}