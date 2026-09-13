import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { PlanYourVisit } from "@/components/site/PlanYourVisit";
import { CHURCH, SERVICES, SITE_URL } from "@/lib/church";
import { useLang } from "@/lib/i18n";

const TITLE = "Visit & Contact | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Visit us at 14615 Aldine Westfield Rd, Houston, TX 77039. Directions, service times, and how to reach The Vine Apostolic Church.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/contact` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
  }),
  component: Contact,
});

function Contact() {
  const { t } = useLang();

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={t("Visítanos", "Visit us")}
        title={t("Contacto", "Contact")}
        intro={t(
          "Estamos en el norte de Houston, sobre Aldine Westfield Road. Ven tal como eres.",
          "We're in north Houston on Aldine Westfield Road. Come as you are.",
        )}
      />

      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2">
        <div>
          <h2 className="mb-6 font-display text-3xl uppercase">{t("Dirección", "Address")}</h2>
          <address className="font-display text-3xl uppercase not-italic leading-tight text-foreground/80">
            {CHURCH.address}
            <br />
            {CHURCH.city}
          </address>
          <a
            href={CHURCH.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="group mt-8 inline-flex items-center gap-4"
          >
            <span className="flex size-12 items-center justify-center bg-primary font-bold text-primary-foreground">
              →
            </span>
            <span className="font-mono text-xs uppercase tracking-widest underline decoration-primary/30 underline-offset-4 transition-colors group-hover:text-primary">
              {t("Cómo llegar", "Get directions")}
            </span>
          </a>

          <h2 className="mb-6 mt-16 font-display text-3xl uppercase">{t("Llámanos", "Call us")}</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${CHURCH.phone}`}
              className="inline-block bg-primary px-6 py-3 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {CHURCH.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${CHURCH.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block border border-primary px-6 py-3 font-mono text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              WhatsApp
            </a>
          </div>

          <h2 className="mb-6 mt-16 font-display text-3xl uppercase">
            {t("Escríbenos", "Email us")}
          </h2>
          <a
            href={`mailto:${CHURCH.email}`}
            className="font-mono text-sm text-primary underline underline-offset-4"
          >
            {CHURCH.email}
          </a>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t("También respondemos por Facebook", "We also answer on Facebook")}
          </p>
          <a
            href={CHURCH.facebook}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block font-mono text-xs uppercase tracking-widest text-primary"
          >
            facebook.com/thevinehouston
          </a>

          <h2 className="mb-6 mt-16 font-display text-3xl uppercase">{t("Oración", "Prayer")}</h2>
          <p className="text-sm text-foreground/60">
            {t(
              "¿Necesitas oración? Envíanos tu petición y oramos por ti.",
              "Need prayer? Send us your request and we'll pray for you.",
            )}
          </p>
          <Link
            to="/prayer"
            className="mt-4 inline-block border border-primary px-6 py-3 font-mono text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {t("Petición de oración", "Prayer request")}
          </Link>
        </div>

        <div>
          <h2 className="mb-6 font-display text-3xl uppercase">{t("Horarios", "Service times")}</h2>
          <div className="divide-y divide-border border-y border-border">
            {SERVICES.map((s) => (
              <div key={`${s.day.es}-${s.time}`} className="flex items-end justify-between py-6">
                <div>
                  <span className="font-display text-2xl uppercase">{t(s.day)}</span>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {t(s.detail)}
                  </p>
                </div>
                <span className="font-mono text-primary">{s.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden border border-border">
            <iframe
              title={t("Mapa a The Vine Apostolic Church", "Map to The Vine Apostolic Church")}
              src="https://www.google.com/maps?q=14615+Aldine+Westfield+Rd,+Houston,+TX+77039&output=embed"
              loading="lazy"
              className="h-80 w-full"
            />
          </div>
        </div>
      </section>

      <PlanYourVisit />

      <SiteFooter />
    </>
  );
}
