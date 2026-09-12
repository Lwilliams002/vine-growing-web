import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { CHURCH, SERVICES, SITE_URL } from "@/lib/church";

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
  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="Visítanos / Visit Us"
        title="Contacto"
        intro="Estamos en el norte de Houston, sobre Aldine Westfield Road. Ven tal como eres."
      />

      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2">
        <div>
          <h2 className="mb-6 font-display text-3xl uppercase">Dirección</h2>
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
              Get Directions
            </span>
          </a>

          <h2 className="mb-6 mt-16 font-display text-3xl uppercase">Escríbenos</h2>
          <a
            href={`mailto:${CHURCH.email}`}
            className="font-mono text-sm text-primary underline underline-offset-4"
          >
            {CHURCH.email}
          </a>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            También respondemos por Facebook
          </p>
          <h2 className="mb-6 mt-16 font-display text-3xl uppercase">Oración</h2>
          <p className="text-sm text-foreground/60">
            ¿Necesitas oración? Envíanos tu petición y oramos por ti.
          </p>
          <Link
            to="/prayer"
            className="mt-4 inline-block border border-primary px-6 py-3 font-mono text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Petición de Oración / Prayer Request
          </Link>
          <a
            href={CHURCH.facebook}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block font-mono text-xs uppercase tracking-widest text-primary"
          >
            facebook.com/thevinehouston
          </a>
        </div>

        <div>
          <h2 className="mb-6 font-display text-3xl uppercase">Horarios</h2>
          <div className="divide-y divide-border border-y border-border">
            {SERVICES.map((s) => (
              <div key={s.day} className="flex items-end justify-between py-6">
                <div>
                  <span className="font-display text-2xl uppercase">{s.day}</span>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {s.detail}
                  </p>
                </div>
                <span className="font-mono text-primary">{s.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden border border-border">
            <iframe
              title="Map to The Vine Apostolic Church"
              src="https://www.google.com/maps?q=14615+Aldine+Westfield+Rd,+Houston,+TX+77039&output=embed"
              loading="lazy"
              className="h-80 w-full"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
