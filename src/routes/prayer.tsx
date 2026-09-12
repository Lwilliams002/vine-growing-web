import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CHURCH, SITE_URL } from "@/lib/church";
import { prayerRequestSchema, type PrayerRequest } from "@/lib/prayer-schema";
import prayerImg from "@/assets/prayer-hands.jpg";

const TITLE = "Prayer Request | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Envía tu petición de oración y nuestro equipo pastoral orará por ti. Submit a prayer request and The Vine's pastoral team will pray for you.";

export const Route = createFileRoute("/prayer")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/prayer` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/prayer` }],
  }),
  component: Prayer,
});

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const SEND_ERROR =
  "No pudimos enviar tu petición. Intenta de nuevo o escríbenos por Facebook. / We couldn't send your request. Please try again or message us on Facebook.";

type DeliverResult = { ok: true } | { ok: false; error: string };

// Web3Forms emails each submission to the church inbox. Their free plan only
// accepts requests sent from the browser, so delivery runs client-side.
async function deliverPrayerRequest(data: PrayerRequest): Promise<DeliverResult> {
  // Honeypot filled in: a bot. Pretend it worked so it learns nothing.
  if (data.website) return { ok: true };

  const label = data.confidential ? "[CONFIDENCIAL] " : "";
  const name = data.name || "Anónimo / Anonymous";
  const body = {
    access_key: CHURCH.web3formsKey,
    subject: `${label}Petición de Oración / Prayer Request — ${name}`,
    from_name: `${CHURCH.shortName} Website`,
    name,
    ...(data.email ? { email: data.email } : {}),
    phone: data.phone || "—",
    confidential: data.confidential ? "Sí / Yes" : "No",
    message: data.request,
  };

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => null)) as { success?: boolean } | null;
    if (!res.ok || !json?.success) {
      console.error("Web3Forms rejected prayer request", res.status, json);
      return { ok: false, error: SEND_ERROR };
    }
    return { ok: true };
  } catch (err) {
    console.error("Web3Forms request failed", err);
    return { ok: false, error: SEND_ERROR };
  }
}

const fieldClass =
  "rounded-none border-border bg-background px-4 py-6 font-body text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary";

function Prayer() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<PrayerRequest>({
    resolver: zodResolver(prayerRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      request: "",
      confidential: false,
      website: "",
    },
  });

  const { register, handleSubmit, formState, setValue, watch, reset } = form;
  const { errors, isSubmitting } = formState;
  const confidential = watch("confidential");

  async function onSubmit(data: PrayerRequest) {
    setServerError(null);
    const result = await deliverPrayerRequest(data);
    if (result.ok) {
      setStatus("sent");
      reset();
    } else {
      setStatus("error");
      setServerError(result.error);
    }
  }

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="Oración / Prayer"
        title="Oramos Por Ti"
        intro="Cuéntanos cómo podemos orar por ti. Nuestro equipo pastoral lee cada petición y ora por ella durante la semana. Tell us how we can pray for you — every request is read and prayed over by our pastoral team."
      />

      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-[1fr_1.2fr]">
        <div>
          <img
            src={prayerImg}
            alt="Family praying together at The Vine Apostolic Church"
            width={1200}
            height={1500}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover ring-1 ring-border"
          />
          <blockquote className="mt-8 font-mono text-sm italic leading-relaxed text-foreground/60">
            &ldquo;Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios
            en toda oración y ruego, con acción de gracias.&rdquo;
            <span className="mt-3 block not-italic uppercase tracking-widest text-primary">
              Filipenses 4:6
            </span>
          </blockquote>
        </div>

        <div className="border border-border bg-card p-8 md:p-12">
          {status === "sent" ? (
            <div className="animate-fade-up">
              <span className="eyebrow mb-6 block text-primary">Recibido / Received</span>
              <h2 className="font-display text-4xl uppercase leading-none md:text-5xl">
                Estamos orando por ti
              </h2>
              <p className="mt-6 text-foreground/70">
                Gracias por confiar en nosotros. Tu petición llegó a nuestro equipo pastoral.
              </p>
              <p className="mt-2 font-mono text-sm italic text-muted-foreground">
                Thank you for trusting us. Your request has reached our pastoral team.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-10 inline-block border border-border px-8 py-4 font-mono text-xs uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
              >
                Enviar otra / Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
              <div>
                <Label htmlFor="name" className="eyebrow mb-3 block text-muted-foreground">
                  Nombre / Name
                </Label>
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="Opcional / Optional"
                  aria-invalid={!!errors.name}
                  className={fieldClass}
                  {...register("name")}
                />
                {errors.name ? <FieldError>{errors.name.message}</FieldError> : null}
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email" className="eyebrow mb-3 block text-muted-foreground">
                    Correo / Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    className={fieldClass}
                    {...register("email")}
                  />
                  {errors.email ? <FieldError>{errors.email.message}</FieldError> : null}
                </div>
                <div>
                  <Label htmlFor="phone" className="eyebrow mb-3 block text-muted-foreground">
                    Teléfono / Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    className={fieldClass}
                    {...register("phone")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="request" className="eyebrow mb-3 block text-muted-foreground">
                  Petición de oración / Prayer request *
                </Label>
                <Textarea
                  id="request"
                  rows={7}
                  aria-invalid={!!errors.request}
                  placeholder="¿Por qué podemos orar? / How can we pray for you?"
                  className={`${fieldClass} min-h-40 resize-y`}
                  {...register("request")}
                />
                {errors.request ? <FieldError>{errors.request.message}</FieldError> : null}
              </div>

              {/* Honeypot: hidden from people, tempting for bots */}
              <div
                className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
                aria-hidden="true"
              >
                <label htmlFor="website">Website</label>
                <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="confidential"
                  checked={confidential}
                  onCheckedChange={(v) => setValue("confidential", v === true)}
                  className="mt-0.5 rounded-none border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <Label
                  htmlFor="confidential"
                  className="text-sm leading-relaxed text-foreground/70"
                >
                  Confidencial: solo el equipo pastoral verá esta petición.
                  <span className="block font-mono text-xs italic text-muted-foreground">
                    Confidential: only the pastoral team will see this request.
                  </span>
                </Label>
              </div>

              {status === "error" && serverError ? (
                <p
                  role="alert"
                  className="border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground/80"
                >
                  {serverError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary px-10 py-5 font-display text-lg uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Enviando… / Sending…" : "Enviar Petición / Send Request"}
              </button>

              <p className="font-mono text-[10px] uppercase leading-loose tracking-widest text-muted-foreground">
                ¿Prefieres hablar con alguien? Escríbenos por{" "}
                <a href={CHURCH.facebook} target="_blank" rel="noreferrer" className="text-primary">
                  Facebook
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 font-mono text-xs text-destructive">
      {children}
    </p>
  );
}
