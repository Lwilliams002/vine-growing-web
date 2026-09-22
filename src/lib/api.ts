import { CHURCH } from "./church";

/**
 * Thin client for the church's Cloudflare Worker (the same backend the
 * Vine Life Groups app uses). Public reads need no token; admin writes send
 * the bearer token saved by the /admin sign-in.
 */

const TOKEN_KEY = "vine-admin-token";

export const API_URL: string =
  (import.meta.env["VITE_API_URL"] as string | undefined)?.replace(/\/+$/, "") || CHURCH.appApiUrl;

export function getToken(): string | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Options = { method?: string; json?: unknown; auth?: boolean };

export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.json !== undefined) headers["Content-Type"] = "application/json";
  if (opts.auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, {
    method: opts.method ?? (opts.json !== undefined ? "POST" : "GET"),
    headers,
    body: opts.json !== undefined ? JSON.stringify(opts.json) : null,
  });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const err = (data ?? {}) as { error?: string; message?: string };
    throw new ApiError(
      res.status,
      err.error ?? "error",
      err.message ?? `Request failed (${res.status})`,
    );
  }
  return data as T;
}

/* ---------------- auth (shared with the app) ---------------- */

export type AdminUser = { id: string; email: string; role: "member" | "leader" | "super_admin" };

export async function signIn(email: string, password: string): Promise<AdminUser> {
  const r = await api<{ token: string; user: AdminUser }>("/auth/sign-in", {
    json: { email: email.trim().toLowerCase(), password },
  });
  setToken(r.token);
  return r.user;
}

export async function signOut(): Promise<void> {
  try {
    await api("/auth/sign-out", { method: "POST", auth: true, json: {} });
  } catch {
    /* token may already be gone */
  }
  setToken(null);
}

/** The signed-in user, or null when there is no valid session. */
export async function currentUser(): Promise<AdminUser | null> {
  if (!getToken()) return null;
  try {
    return await api<AdminUser>("/auth/me", { auth: true });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) setToken(null);
    return null;
  }
}
