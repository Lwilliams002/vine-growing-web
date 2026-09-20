import type { Bilingual } from "./i18n";
import friendsDayEn from "@/assets/flyers/friends-day-en.jpg";
import friendsDayEs from "@/assets/flyers/friends-day-es.jpg";
import combinedService from "@/assets/flyers/combined-service.jpg";

/**
 * Event flyers shown on /events and (the next one) on the home page.
 * Add a new entry when there is a flyer; past-dated flyers disappear on
 * their own the day after the event.
 */
export type Flyer = {
  id: string;
  title: Bilingual;
  detail: Bilingual;
  /** YYYY-MM-DD, local church date. */
  date: string;
  time: string;
  /** One image per language; both may point to the same file. */
  image: { es: string; en: string };
  /** Width/height of the image, for layout stability. */
  size: { width: number; height: number };
};

export const FLYERS: readonly Flyer[] = [
  {
    id: "friends-day-2026",
    title: { es: "Día del Amigo", en: "Friend's Day" },
    detail: {
      es: "Ven con tu mejor traje típico. ¡La amistad también se celebra!",
      en: "Come in your best traditional attire. Friendship is worth celebrating!",
    },
    date: "2026-09-20",
    time: "11:00 AM",
    image: { es: friendsDayEs, en: friendsDayEn },
    size: { width: 1402, height: 1122 },
  },
  {
    id: "honrando-familia-pastoral-2026",
    title: { es: "Honrando a la Familia Pastoral", en: "Honoring the Pastoral Family" },
    detail: {
      es: "Servicio combinado. Escanea el código QR del volante para registrarte.",
      en: "Combined service. Scan the QR code on the flyer to register.",
    },
    date: "2026-09-27",
    time: "11:30 AM",
    image: { es: combinedService, en: combinedService },
    size: { width: 1600, height: 900 },
  },
];

/** Flyers whose event date is today or later, soonest first. */
export function upcomingFlyers(today: string = new Date().toISOString().slice(0, 10)): Flyer[] {
  return FLYERS.filter((f) => f.date >= today).sort((a, b) => a.date.localeCompare(b.date));
}
