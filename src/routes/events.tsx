import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { AnnouncementList } from "@/components/site/Announcements";
import { CHURCH, SITE_URL } from "@/lib/church";
import { fetchPublicAnnouncements } from "@/lib/announcements";
import { useAnnouncements } from "@/lib/use-announcements";
import { useLang } from "@/lib/i18n";

const TITLE = "Events & Announcements | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Announcements and upcoming gatherings at The Vine Apostolic Church, 14615 Aldine Westfield Rd, Houston, TX 77039.";

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
        eyebrow={t("Anuncios", "Announcements")}
        title={t("Eventos", "Events")}
        intro={t(
          "Lo que viene este mes en La Vid. Todos son bienvenidos: trae a tu familia.",
          "What's coming up this month at The Vine. Everyone is welcome, bring your family.",
        )}
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
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
