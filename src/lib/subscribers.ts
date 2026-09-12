import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabase } from "./supabase";

const TABLE = "subscribers";

// The generated Database type does not know this table yet, so talk to it untyped.
function table(sb: unknown) {
  return (sb as SupabaseClient).from(TABLE);
}

export type SubscribeResult = { ok: true; already?: boolean } | { ok: false; error: string };

const GENERIC_ERROR =
  "No pudimos guardar tu correo. Intenta de nuevo. / We couldn't save your email. Please try again.";

export async function subscribe(rawEmail: string): Promise<SubscribeResult> {
  const email = rawEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Escribe un correo válido. / Enter a valid email." };
  }
  try {
    const sb = getSupabase();
    if (!sb) return { ok: false, error: GENERIC_ERROR };
    const { error } = await table(sb).insert({ email });
    if (error) {
      // 23505 = unique violation: they are already on the list.
      if (error.code === "23505") return { ok: true, already: true };
      console.error("Subscribe failed", error);
      return { ok: false, error: GENERIC_ERROR };
    }
    return { ok: true };
  } catch (err) {
    console.error("Subscribe failed", err);
    return { ok: false, error: GENERIC_ERROR };
  }
}

export type Subscriber = { id: string; email: string; created_at: string };

/** Admin only (RLS): the full list, newest first. */
export async function fetchSubscribers(): Promise<Subscriber[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await table(sb)
    .select("id,email,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Subscriber[];
}

export async function deleteSubscriber(id: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured");
  const { error } = await table(sb).delete().eq("id", id);
  if (error) throw error;
}
