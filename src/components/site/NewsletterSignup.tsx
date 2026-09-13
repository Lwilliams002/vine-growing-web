import { useState } from "react";

import { subscribe } from "@/lib/subscribers";
import { useLang } from "@/lib/i18n";

/** One-field email signup for announcements. */
export function NewsletterSignup() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "busy" }
    | { kind: "done"; already: boolean }
    | { kind: "error"; text: string }
  >({ kind: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ kind: "busy" });
    const result = await subscribe(email);
    if (result.ok) {
      setState({ kind: "done", already: Boolean(result.already) });
      setEmail("");
    } else {
      setState({ kind: "error", text: result.error });
    }
  }

  return (
    <section className="border-y border-border bg-card px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div>
          <span className="eyebrow mb-4 block text-primary">
            {t("Mantente al día", "Stay in the loop")}
          </span>
          <h2 className="text-balance font-display text-4xl uppercase leading-none md:text-5xl">
            {t("Recibe los anuncios", "Get the announcements")}
          </h2>
          <p className="mt-4 max-w-md text-sm text-foreground/60">
            {t(
              "Eventos, cambios de horario y noticias de la iglesia en tu correo. Sin spam.",
              "Events, schedule changes, and church news in your inbox. No spam.",
            )}
          </p>
        </div>

        {state.kind === "done" ? (
          <p role="status" className="border border-primary/40 bg-background p-6 font-mono text-sm">
            {state.already
              ? t("Ya estabas en la lista. ¡Gracias!", "You were already on the list. Thank you!")
              : t("¡Listo! Te avisaremos.", "You're in. We'll keep you posted.")}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              {t("Correo", "Email")}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              placeholder={t("tu@correo.com", "you@email.com")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 border border-border bg-background px-5 py-4 font-body text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={state.kind === "busy"}
              className="bg-primary px-8 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-60"
            >
              {state.kind === "busy" ? t("Enviando…", "Sending…") : t("Suscribirme", "Subscribe")}
            </button>
            {state.kind === "error" ? (
              <p role="alert" className="font-mono text-xs text-destructive sm:basis-full">
                {state.text}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
