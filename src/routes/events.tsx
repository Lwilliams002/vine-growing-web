import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { AnnouncementList } from "@/components/site/Announcements";
import { CHURCH, SERVICES, SITE_URL } from "@/lib/church";
import { fetchPublicAnnouncements } from "@/lib/announcements";

const TITLE = "Events & Service Times | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Weekly service times, announcements, and upcoming gatherings at The Vine Apostolic Church, 14615 Aldine Westfield Rd, Houston, TX 77039.";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/events` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/events` }],
  }),
  loader: () => fetchPublicAnnouncements(),
  staleTime: 60_000,
  component: Events,
});

function Events() {
  const announcements = Route.useLoaderData();

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="Calendario / Calendar"
        title="Eventos"
        intro="Nuestros servicios semanales y los anuncios del mes. Everyone is welcome — trae a tu familia."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-8 font-display text-4xl uppercase">Horarios Semanales</h2>
        <div className="grid gap-1 md:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={`${s.day}-${s.time}`} className="border border-border bg-card p-10">
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                {s.day}
              </span>
              <h3 className="mt-4 font-display text-4xl uppercase">{s.time}</h3>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {s.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-8 mt-24 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-4xl uppercase">Anuncios y Eventos</h2>
          <span className="eyebrow mb-2 text-muted-foreground">Announcements &amp; events</span>
        </div>
        <AnnouncementList
          items={announcements}
          emptyText="No hay anuncios por ahora. Síguenos en Facebook. / No announcements right now. Follow us on Facebook."
        />

        <p className="mt-16 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Todos los eventos en {CHURCH.address}, {CHURCH.city}
        </p>
      </section>

      <SiteFooter />
    </>
  );
}
