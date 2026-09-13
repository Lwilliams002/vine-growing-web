import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { AnnouncementList } from "@/components/site/Announcements";
import { CHURCH, SERVICES, SITE_URL } from "@/lib/church";
import { fetchPublicAnnouncements } from "@/lib/announcements";
import { useAnnouncements } from "@/lib/use-announcements";
import { useLang } from "@/lib/i18n";

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
  const announcements = useAnnouncements(Route.useLoaderData());
  const { t } = useLang();

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={t("Calendario", "Calendar")}
        title={t("Eventos", "Events")}
        intro={t(
          "Nuestros servicios semanales y los anuncios del mes. Todos son bienvenidos: trae a tu familia.",
          "Our weekly services and this month's announcements. Everyone is welcome, bring your family.",
        )}
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-8 font-display text-4xl uppercase">
          {t("Horarios Semanales", "Weekly Services")}
        </h2>
        <div className="grid gap-1 md:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={`${s.day.es}-${s.time}`} className="border border-border bg-card p-10">
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                {t(s.day)}
              </span>
              <h3 className="mt-4 font-display text-4xl uppercase">{s.time}</h3>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {t(s.detail)}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-8 mt-24 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-4xl uppercase">
            {t("Anuncios y Eventos", "Announcements & Events")}
          </h2>
        </div>
        <AnnouncementList
          items={announcements}
          emptyText={t(
            "No hay anuncios por ahora. Síguenos en Facebook.",
            "No announcements right now. Follow us on Facebook.",
          )}
        />

        <p className="mt-16 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {t("Todos los eventos en", "All events at")} {CHURCH.address}, {CHURCH.city}
        </p>
      </section>

      <SiteFooter />
    </>
  );
}
