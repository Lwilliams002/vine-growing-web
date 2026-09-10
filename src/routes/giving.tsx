import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { CHURCH } from "@/lib/church";

const TITLE = "Giving | The Vine Apostolic Church Houston";
const DESCRIPTION =
  "Support the ministry of The Vine Apostolic Church in Houston with your tithes and offerings. Diezmos y ofrendas.";

export const Route = createFileRoute("/giving")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/giving" },
    ],
    links: [{ rel: "canonical", href: "/giving" }],
  }),
  component: Giving,
});

const WAYS = [
  {
    number: "01",
    title: "En el Servicio",
    body: "Trae tu diezmo u ofrenda a cualquiera de nuestros servicios semanales.",
  },
  {
    number: "02",
    title: "Por Correo",
    body: `${CHURCH.address}, ${CHURCH.city}`,
  },
  {
    number: "03",
    title: "En Línea",
    body: "Estamos habilitando las ofrendas en línea. Escríbenos y te enviamos el enlace.",
  },
];

function Giving() {
  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="Diezmos y Ofrendas"
        title="Apoye La Misión"
        intro="Tu generosidad sostiene la obra en Houston: alcance comunitario, ministerio de niños y misiones."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
          {WAYS.map((w) => (
            <div key={w.number} className="border border-border bg-card p-10">
              <span className="font-mono text-xs text-primary">{w.number}</span>
              <h2 className="mb-3 mt-10 font-display text-2xl uppercase">{w.title}</h2>
              <p className="text-sm leading-relaxed text-foreground/60">{w.body}</p>
            </div>
          ))}
        </div>

        <blockquote className="mx-auto mt-24 max-w-2xl text-center font-mono text-sm italic text-foreground/60">
          &ldquo;Cada uno dé como propuso en su corazón: no con tristeza, ni por
          necesidad, porque Dios ama al dador alegre.&rdquo;
          <span className="mt-4 block not-italic uppercase tracking-widest text-primary">
            2 Corintios 9:7
          </span>
        </blockquote>
      </section>

      <SiteFooter />
    </>
  );
}
