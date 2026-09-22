import { z } from "zod";

import { api } from "./api";

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

/**
 * Published announcements for the public site: pinned first, then soonest
 * event date, then newest. Past-dated events are hidden by the API.
 * Never throws; an unreachable backend just yields [].
 */
export async function fetchPublicAnnouncements(limit = 50): Promise<Announcement[]> {
  try {
    return await api<Announcement[]>(`/site/announcements?limit=${limit}`);
  } catch (err) {
    console.error("Announcements unavailable", err);
    return [];
  }
}

/** Every announcement, for the admin screen. Requires a signed-in admin. */
export function fetchAllAnnouncements(): Promise<Announcement[]> {
  return api<Announcement[]>("/site/announcements/all", { auth: true });
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

export async function createAnnouncement(form: AnnouncementForm): Promise<void> {
  await api("/site/announcements", { method: "POST", auth: true, json: form });
}

export async function updateAnnouncement(id: string, form: AnnouncementForm): Promise<void> {
  await api(`/site/announcements/${id}`, { method: "PATCH", auth: true, json: form });
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await api(`/site/announcements/${id}`, { method: "DELETE", auth: true });
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
