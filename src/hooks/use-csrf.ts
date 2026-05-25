import { useState, useEffect } from "react";

export function useCSRFToken() {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const match = document.cookie.match(/csrf-token=([^;]+)/);
    if (match) {
      setToken(match[1]);
    }
  }, []);

  return token;
}

export async function withCSRFToken(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const match = document.cookie.match(/csrf-token=([^;]+)/);
  const token = match ? match[1] : "";

  const headers = new Headers(options.headers);
  headers.set("x-csrf-token", token);

  return fetch(url, {
    ...options,
    headers,
  });
}