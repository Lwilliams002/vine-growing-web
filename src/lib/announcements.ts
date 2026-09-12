import { z } from "zod";

import { getSupabase } from "./supabase";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  event_date: string | null; // YYYY-MM-DD
  event_time: string | null;
  link_url: string | null;
  link_label: string | null;
  is_pinned: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

const TABLE = "announcements";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Published announcements for the public site: pinned first, then soonest
 * event date, then newest. Past-dated events are hidden automatically.
 * Never throws; a misconfigured or unreachable backend just yields [].
 */
export async function fetchPublicAnnouncements(limit = 50): Promise<Announcement[]> {
  try {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb
      .from(TABLE)
      .select("*")
      .eq("is_published", true)
      .or(`event_date.is.null,event_date.gte.${todayIso()}`)
      .order("is_pinned", { ascending: false })
      .order("event_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("Failed to load announcements", error);
      return [];
    }
    return (data ?? []) as Announcement[];
  } catch (err) {
    // Missing backend config or network failure must never break the public site.
    console.error("Announcements unavailable", err);
    return [];
  }
}

/** Every announcement, for the admin screen. Requires a signed-in session. */
export async function fetchAllAnnouncements(): Promise<Announcement[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("event_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Announcement[];
}

const optionalText = z.string().trim().max(200);

export const announcementFormSchema = z.object({
  title: z.string().trim().min(2, "Escribe un título / Enter a title").max(120),
  body: z.string().trim().min(5, "Escribe el anuncio / Enter the announcement").max(2000),
  event_date: z
    .string()
    .trim()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Fecha inválida / Invalid date"),
  event_time: optionalText,
  link_url: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => v === "" || /^https?:\/\//.test(v),
      "Debe empezar con https:// / Must start with https://",
    ),
  link_label: optionalText,
  is_pinned: z.boolean(),
  is_published: z.boolean(),
});

export type AnnouncementForm = z.infer<typeof announcementFormSchema>;

function toRow(form: AnnouncementForm) {
  return {
    title: form.title,
    body: form.body,
    event_date: form.event_date || null,
    event_time: form.event_time || null,
    link_url: form.link_url || null,
    link_label: form.link_label || null,
    is_pinned: form.is_pinned,
    is_published: form.is_published,
  };
}

export async function createAnnouncement(form: AnnouncementForm): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured");
  const { error } = await sb.from(TABLE).insert(toRow(form));
  if (error) throw error;
}

export async function updateAnnouncement(id: string, form: AnnouncementForm): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured");
  const { error } = await sb.from(TABLE).update(toRow(form)).eq("id", id);
  if (error) throw error;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured");
  const { error } = await sb.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

export function toForm(a: Announcement): AnnouncementForm {
  return {
    title: a.title,
    body: a.body,
    event_date: a.event_date ?? "",
    event_time: a.event_time ?? "",
    link_url: a.link_url ?? "",
    link_label: a.link_label ?? "",
    is_pinned: a.is_pinned,
    is_published: a.is_published,
  };
}

export const EMPTY_FORM: AnnouncementForm = {
  title: "",
  body: "",
  event_date: "",
  event_time: "",
  link_url: "",
  link_label: "",
  is_pinned: false,
  is_published: true,
};
