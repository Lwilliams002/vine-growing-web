import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { CHURCH, SERVICES } from "@/lib/church";

const TITLE = "Events & Service Times | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Weekly service times and upcoming gatherings at The Vine Apostolic Church, 14615 Aldine Westfield Rd, Houston, TX 77039.";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/events" },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: Events,
});

const EVENTS = [
  {
    name: "Noche de Alabanza / Worship Night",
    when: "Último viernes del mes · 7:30 PM",
    detail: "Una noche entera de adoración, oración y ministración.",
  },
  {
    name: "Ayuno y Oración",
    when: "Primer sábado · 8:00 AM",
    detail: "Comenzamos el mes buscando el rostro de Dios juntos.",
  },
  {
    name: "Servicio de Jóvenes",
    when: "Viernes · 7:00 PM",
    detail: "Alabanza, palabra y comunidad para la nueva generación.",
  },
];

function Events() {
  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="Calendario / Calendar"
        title="Eventos"
        intro="Nuestros servicios semanales y las reuniones especiales del mes. Everyone is welcome — trae a tu familia."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-8 font-display text-4xl uppercase">Horarios Semanales</h2>
        <div className="grid gap-1 md:grid-cols-2">
          {SERVICES.map((s) => (
            <div key={s.day} className="border border-border bg-card p-10">
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

        <h2 className="mb-8 mt-24 font-display text-4xl uppercase">Próximas Reuniones</h2>
        <div className="divide-y divide-border border-y border-border">
          {EVENTS.map((e) => (
            <article
              key={e.name}
              className="flex flex-col gap-2 py-8 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="font-display text-2xl uppercase">{e.name}</h3>
                <p className="mt-1 text-sm text-foreground/60">{e.detail}</p>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                {e.when}
              </span>
            </article>
          ))}
        </div>

        <p className="mt-16 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Todos los eventos en {CHURCH.address}, {CHURCH.city}
        </p>
      </section>

      <SiteFooter />
    </>
  );
}
