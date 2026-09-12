import { z } from "zod";

export const prayerRequestSchema = z.object({
  // Optional: people may ask for prayer anonymously.
  name: z.string().trim().max(80, "Máximo 80 caracteres / 80 characters max"),
  email: z.string().trim().email("Correo inválido / Invalid email").max(120).or(z.literal("")),
  phone: z.string().trim().max(30),
  request: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más / Tell us a little more")
    .max(3000, "Máximo 3000 caracteres / 3000 characters max"),
  confidential: z.boolean(),
  // Honeypot: real users never see this field, bots fill it in.
  website: z.string().max(0).optional(),
});

export type PrayerRequest = z.infer<typeof prayerRequestSchema>;
