import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { CHURCH } from "@/lib/church";
import sermonImg from "@/assets/sermon-still.jpg";

const TITLE = "Sermons & Media | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Watch and listen to recent messages from The Vine Apostolic Church in Houston. Mensajes recientes de la Palabra.";

export const Route = createFileRoute("/sermons")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/sermons" },
    ],
    links: [{ rel: "canonical", href: "/sermons" }],
  }),
  component: Sermons,
});

const SERMONS = [
  {
    title: "El Poder del Espíritu Santo",
    verse: "2 Timoteo 1:7",
    date: "Domingo / Sunday",
  },
  { title: "Permanece en la Vid", verse: "Juan 15:5", date: "Domingo / Sunday" },
  { title: "Fe Que No Se Rinde", verse: "Hebreos 11:1", date: "Miércoles / Wednesday" },
];

function Sermons() {
  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="Última Palabra / Latest Word"
        title="Mensajes"
        intro="Cada semana predicamos la Palabra sin diluirla. Full services are streamed and archived on our Facebook page."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid border border-border bg-card md:grid-cols-2">
          <div className="p-12 md:p-16">
            <span className="mb-6 block font-mono text-xs uppercase tracking-widest text-primary">
              Mensaje Destacado
            </span>
            <h2 className="mb-6 text-balance font-display text-5xl uppercase leading-none">
              El Poder del Espíritu Santo
            </h2>
            <p className="mb-10 font-mono text-sm italic text-foreground/60">
              &ldquo;Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de
              amor y de dominio propio.&rdquo;
            </p>
            <a
              href={CHURCH.facebook}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-primary px-10 py-4 font-display uppercase tracking-widest text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Ver en Facebook
            </a>
          </div>
          <img
            src={sermonImg}
            alt="Pastor preaching into a microphone"
            width={800}
            height={600}
            loading="lazy"
            className="size-full min-h-[360px] object-cover"
          />
        </div>

        <div className="mt-16 divide-y divide-border border-y border-border">
          {SERMONS.map((s) => (
            <div
              key={s.title}
              className="flex flex-col gap-2 py-8 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <h3 className="font-display text-2xl uppercase">{s.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {s.verse}
                </p>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                {s.date}
              </span>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
