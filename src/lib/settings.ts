import { api } from "./api";

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

function fromMap(map: Record<string, string>): SiteSettings {
  return {
    is_live: map["is_live"] === "true",
    live_video_url: map["live_video_url"] ?? "",
    latest_sermon_url: map["latest_sermon_url"] ?? "",
    latest_sermon_title: map["latest_sermon_title"] ?? "",
  };
}

/** Public read. Never throws; falls back to defaults if anything goes wrong. */
export async function fetchSettings(): Promise<SiteSettings> {
  try {
    return fromMap(await api<Record<string, string>>("/site/settings"));
  } catch (err) {
    console.error("Site settings unavailable", err);
    return DEFAULT_SETTINGS;
  }
}

/** Admin write (requires a signed-in admin). */
export async function saveSettings(settings: SiteSettings): Promise<void> {
  await api("/site/settings", {
    method: "PUT",
    auth: true,
    json: {
      is_live: settings.is_live,
      live_video_url: settings.live_video_url.trim(),
      latest_sermon_url: settings.latest_sermon_url.trim(),
      latest_sermon_title: settings.latest_sermon_title.trim(),
    },
  });
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
