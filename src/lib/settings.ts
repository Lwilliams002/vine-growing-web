import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabase } from "./supabase";

/** Keys the pastor can edit from /admin. */
export type SiteSettings = {
  is_live: boolean;
  live_video_url: string;
  latest_sermon_url: string;
  latest_sermon_title: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  is_live: false,
  live_video_url: "",
  latest_sermon_url: "",
  latest_sermon_title: "",
};

const TABLE = "site_settings";

// The generated Database type does not know this table yet, so talk to it untyped.
function table(sb: SupabaseClient<never>) {
  return (sb as unknown as SupabaseClient).from(TABLE);
}

/** Public read. Never throws; falls back to defaults if anything goes wrong. */
export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const sb = getSupabase();
    if (!sb) return DEFAULT_SETTINGS;
    const { data, error } = await table(sb as never).select("key,value");
    if (error) {
      console.error("Failed to load site settings", error);
      return DEFAULT_SETTINGS;
    }
    const map = new Map((data as { key: string; value: string }[]).map((r) => [r.key, r.value]));
    return {
      is_live: map.get("is_live") === "true",
      live_video_url: map.get("live_video_url") ?? "",
      latest_sermon_url: map.get("latest_sermon_url") ?? "",
      latest_sermon_title: map.get("latest_sermon_title") ?? "",
    };
  } catch (err) {
    console.error("Site settings unavailable", err);
    return DEFAULT_SETTINGS;
  }
}

/** Admin write (requires a signed-in session). */
export async function saveSettings(settings: SiteSettings): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured");
  const rows = [
    { key: "is_live", value: settings.is_live ? "true" : "false" },
    { key: "live_video_url", value: settings.live_video_url.trim() },
    { key: "latest_sermon_url", value: settings.latest_sermon_url.trim() },
    { key: "latest_sermon_title", value: settings.latest_sermon_title.trim() },
  ];
  const { error } = await table(sb as never).upsert(rows, { onConflict: "key" });
  if (error) throw error;
}

/** True for URLs the Facebook video player can embed. */
export function isFacebookVideoUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!/(^|\.)facebook\.com$|(^|\.)fb\.watch$/.test(u.hostname)) return false;
    return /\/videos\/|\/live\/|\/reel\/|\/watch|fb\.watch/.test(u.href);
  } catch {
    return false;
  }
}
