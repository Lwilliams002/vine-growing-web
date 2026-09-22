import { api, ApiError } from "./api";

export type SubscribeResult = { ok: true; already?: boolean } | { ok: false; error: string };

const GENERIC_ERROR =
  "No pudimos guardar tu correo. Intenta de nuevo. / We couldn't save your email. Please try again.";

export async function subscribe(rawEmail: string): Promise<SubscribeResult> {
  const email = rawEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Escribe un correo válido. / Enter a valid email." };
  }
  try {
    const r = await api<{ ok: true; already: boolean }>("/site/subscribers", { json: { email } });
    return { ok: true, already: r.already };
  } catch (err) {
    if (err instanceof ApiError && err.status === 400) {
      return { ok: false, error: "Escribe un correo válido. / Enter a valid email." };
    }
    console.error("Subscribe failed", err);
    return { ok: false, error: GENERIC_ERROR };
  }
}

export type Subscriber = { id: string; email: string; created_at: string };

/** Admin only: the full list, newest first. */
export function fetchSubscribers(): Promise<Subscriber[]> {
  return api<Subscriber[]>("/site/subscribers", { auth: true });
}

export async function deleteSubscriber(id: string): Promise<void> {
  await api(`/site/subscribers/${id}`, { method: "DELETE", auth: true });
}
