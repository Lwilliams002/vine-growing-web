import { z } from "zod";

import type { Lang } from "./i18n";

const MESSAGES = {
  es: {
    nameMax: "Máximo 80 caracteres",
    email: "Correo inválido",
    requestMin: "Cuéntanos un poco más",
    requestMax: "Máximo 3000 caracteres",
  },
  en: {
    nameMax: "80 characters max",
    email: "Invalid email",
    requestMin: "Tell us a little more",
    requestMax: "3000 characters max",
  },
} as const;

export function makePrayerRequestSchema(lang: Lang) {
  const m = MESSAGES[lang];
  return z.object({
    // Optional: people may ask for prayer anonymously.
    name: z.string().trim().max(80, m.nameMax),
    email: z.string().trim().email(m.email).max(120).or(z.literal("")),
    phone: z.string().trim().max(30),
    request: z.string().trim().min(10, m.requestMin).max(3000, m.requestMax),
    confidential: z.boolean(),
    // Honeypot: real users never see this field, bots fill it in.
    website: z.string().max(0).optional(),
  });
}

export type PrayerRequest = z.infer<ReturnType<typeof makePrayerRequestSchema>>;
